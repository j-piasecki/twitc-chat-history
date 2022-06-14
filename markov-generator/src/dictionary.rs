use rand::Rng;
use std::collections::HashMap;
use std::fs::File;
use std::io::{prelude::*, BufReader};

#[derive(Debug)]
pub struct DictionaryBuilder {
    map: HashMap<String, DictionaryBuilderNode>,
}

impl DictionaryBuilder {
    pub fn from_file(path: &str) -> Self {
        let mut dictionary = DictionaryBuilder {
            map: HashMap::new(),
        };

        let file = File::open(path).expect("Cannot open file");
        let reader = BufReader::new(file);

        for line in reader.lines() {
            let result = line.expect("Error reading line").to_lowercase();
            let words = result.split(" ");

            let mut previous_word = None;
            for word in words {
                if let Some(prev) = previous_word {
                    dictionary.add_pair(prev, word);
                } else {
                    dictionary.add_beginning(word);
                }

                previous_word = Some(word);
            }

            if let Some(prev) = previous_word {
                dictionary.add_end(prev);
            }
        }

        dictionary
    }

    fn add_pair(&mut self, first: &str, second: &str) {
        self.get_node(first).push(second);
    }

    fn add_beginning(&mut self, word: &str) {
        self.get_node(word).increment_start();
    }

    fn add_end(&mut self, word: &str) {
        self.get_node(word).increment_end();
    }

    fn get_node(&mut self, word: &str) -> &mut DictionaryBuilderNode {
        self.map
            .entry(word.to_string())
            .or_insert(DictionaryBuilderNode::new())
    }

    pub fn build(&self) -> Dictionary {
        let start_counter = self
            .map
            .iter()
            .fold(0, |acc, (_, node)| acc + node.start_counter);

        let end_counter = self
            .map
            .iter()
            .fold(0, |acc, (_, node)| acc + node.end_counter);

        let mut map = HashMap::new();

        for (word, node) in self.map.iter() {
            map.insert(word.to_string(), node.build(end_counter));
        }

        let mut starting_nodes: Vec<DictionaryFollowerNode> = self
            .map
            .iter()
            .map(|(word, node)| {
                DictionaryBuilderFollowerNode {
                    word: word.to_string(),
                    counter: node.start_counter,
                }
                .build(start_counter)
            })
            .collect();

        starting_nodes.retain(|node| node.probability > 0.);

        let mut previous: Option<&DictionaryFollowerNode> = None;
        for node in starting_nodes.iter_mut() {
            if let Some(prev) = previous {
                node.probability += prev.probability;
            }

            previous = Some(node);
        }

        Dictionary {
            nodes: map,
            starting_nodes: starting_nodes,
        }
    }
}

#[derive(Debug)]
struct DictionaryBuilderNode {
    end_counter: i32,
    start_counter: i32,
    followers: HashMap<String, DictionaryBuilderFollowerNode>,
}

impl DictionaryBuilderNode {
    pub fn new() -> Self {
        DictionaryBuilderNode {
            end_counter: 0,
            start_counter: 0,
            followers: HashMap::<String, DictionaryBuilderFollowerNode>::new(),
        }
    }

    pub fn increment_end(&mut self) {
        self.end_counter += 1;
    }

    pub fn increment_start(&mut self) {
        self.start_counter += 1;
    }

    pub fn push(&mut self, word: &str) {
        if let Some(node) = self.followers.get_mut(word) {
            node.increment();
        } else {
            self.followers.insert(
                word.to_string(),
                DictionaryBuilderFollowerNode::new(word.to_string()),
            );
        }
    }

    pub fn build(&self, end_divider: i32) -> DictionaryNode {
        let counter = self
            .followers
            .iter()
            .fold(0, |acc, (_, node)| acc + node.counter);

        let mut followers: Vec<DictionaryFollowerNode> = self
            .followers
            .iter()
            .map(|(_, node)| node.build(counter))
            .collect();

        let mut previous: Option<&DictionaryFollowerNode> = None;
        for node in followers.iter_mut() {
            if let Some(prev) = previous {
                node.probability += prev.probability;
            }

            previous = Some(node);
        }

        DictionaryNode {
            followers: followers,
            end_probability: (self.end_counter as f32) / (end_divider as f32),
        }
    }
}

#[derive(Debug)]
struct DictionaryBuilderFollowerNode {
    word: String,
    counter: i32,
}

impl DictionaryBuilderFollowerNode {
    pub fn new(word: String) -> Self {
        DictionaryBuilderFollowerNode {
            word: word,
            counter: 1,
        }
    }

    pub fn increment(&mut self) {
        self.counter += 1;
    }

    pub fn build(&self, divider: i32) -> DictionaryFollowerNode {
        DictionaryFollowerNode {
            word: self.word.clone(),
            probability: (self.counter as f32) / (divider as f32),
        }
    }
}

#[derive(Debug)]
pub struct Dictionary {
    nodes: HashMap<String, DictionaryNode>,
    starting_nodes: Vec<DictionaryFollowerNode>,
}

impl Dictionary {
    pub fn from_file(path: &str) -> Self {
        DictionaryBuilder::from_file(path).build()
    }

    pub fn generate(&self, start_from: Option<&str>, max_len: i32) -> Option<String> {
        let mut result = if let Some(word) = start_from {
            word
        } else if let Some(word) = self.random_start() {
            word
        } else {
            return None;
        }
        .to_owned();

        if result.len() as i32 > max_len {
            return None;
        }

        let next = self.next_word(&result);

        if let Some(next) = next {
            let root_node = self.nodes.get(&result);
            if let Some(root_node) = root_node {
                let prob: f32 = rand::thread_rng().gen();
                if prob < root_node.end_probability {
                    return Some(result);
                }
            }

            let rest = self.generate(Some(next), max_len - result.len() as i32);

            if let Some(rest) = rest {
                result.push_str(" ");
                result.push_str(&rest);
            }
        }

        Some(result)
    }

    pub fn next_word(&self, current: &str) -> Option<&str> {
        if let Some(node) = self.nodes.get(current) {
            let prob: f32 = rand::thread_rng().gen();

            for child in node.followers.iter() {
                if prob < child.probability {
                    return Some(&child.word);
                }
            }
        }

        None
    }

    fn random_start(&self) -> Option<&str> {
        let prob: f32 = rand::thread_rng().gen();
        for child in self.starting_nodes.iter() {
            if prob < child.probability {
                return Some(&child.word);
            }
        }

        None
    }
}

#[derive(Debug)]
struct DictionaryNode {
    end_probability: f32,
    followers: Vec<DictionaryFollowerNode>,
}

#[derive(Debug)]
struct DictionaryFollowerNode {
    word: String,
    probability: f32,
}
