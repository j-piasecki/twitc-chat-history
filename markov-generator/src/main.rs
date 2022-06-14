mod dictionary;

use crate::dictionary::Dictionary;

fn main() {
    let dictionary = Dictionary::from_file("data.txt");

    println!("{:#?}", dictionary.generate(None, 1000));
}
