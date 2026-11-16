# Pokédex Team Builder

Aplicación web hecha con Angular que consume PokéAPI para explorar Pokémon y armar un equipo de hasta 6 integrantes.

## Funcionalidades
- Búsqueda por nombre o número y filtro por tipo.
- Detalle con estadísticas, habilidades, descripción y cadena evolutiva.
- Constructor de equipo con promedio de stats, Pokémon más fuerte y tipos cubiertos (se guarda en localStorage).
- Mensajes de carga y de error.

## Endpoints de PokéAPI utilizados
| Endpoint | Uso |
|---|---|
| `GET /pokemon?limit=1025` y `GET /pokemon/{id}` | Lista general y detalle (stats, tipos, habilidades) |
| `GET /type` y `GET /type/{name}` | Lista de tipos y filtro por tipo |
| `GET /pokemon-species/{id}` | Descripción y categoría del Pokémon |
| `GET /evolution-chain/{id}` | Cadena evolutiva |

## Ejecutar localmente
```bash
npm install
ng serve
```
Abrir http://localhost:4200

## Sitio desplegado
https://pokedex-angular-esteban-pesantez.vercel.app

## Autor
Esteban Pesantez - Universidad Politécnica Salesiana