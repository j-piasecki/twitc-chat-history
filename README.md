# Twitch chat history

## Konfiguracja

Do uruchomienia bota oraz API wymagana jest baza danych PostgreSQL. Konfiguracja bazy danych jest wczytywana z pliku `db_config.json`, np:

```json
{
  "user": "postgres",
  "host": "localhost",
  "database": "chat_logs",
  "password": "passwd",
  "port": 5432
}
```

Kanały na których będzie nasłuchiwał bot są konfigurowalne plikiem `channels.json`:

```json
{
  "channels": ["kanal1", "kanal2"]
}
```

Do uruchomienia interfejsu w React należy dodać plik config.json w katalogu `bot-frontend/src`, zawierającego URL do API:

```json
{
  "apiUrl": "localhost:8080"
}
```

## Dostępne endpointy

- `/channelId/:channelName` - zwraca id kanału na podstawie nazwy
- `/userId/:userName` - zwraca id użytkownika na podstawie nazwy
- `/userName/:userId` - zwraca nazwę użytkownika na podstawie id
- `/channel/:channel` - zwraca wiadomości w wybranym kanale (`:channel` może być zarówno nazwą jak i id kanału), możliwe parametry:
  - `amount` - liczba wiadomości do zwrócenia, domyślnie 25, musi być w przedziale <10, 100>
  - `last` - id ostatniej otrzymanej wiadomości, wykorzystywane do paginacji
- `/channel/:channel/user/:user` - zwraca wiadomości danego użytkownika w kanale (`:channel` i `:user` może być zarówno nazwą jak i id), możliwe parametry:
  - `amount` - liczba wiadomości do zwrócenia, domyślnie 25, musi być w przedziale <10, 100>
  - `last` - id ostatniej otrzymanej wiadomości, wykorzystywane do paginacji
- `/userChannels/:user` - zwraca liste kanałów na których aktywny był dany użytkownik wraz z liczbą wysłanych tam wiadomości
