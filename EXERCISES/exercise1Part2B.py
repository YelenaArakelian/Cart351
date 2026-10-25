import requests
from rich.console import Console
from rich.table import Table

url = "https://swapi.info/api/planets"

response = requests.get(url)
planets = response.json()

table = Table()

table.add_column("NAME", style="magenta")
table.add_column("DIAMETER", style="blue")
table.add_column("POPULATION", style="cyan")

for planet in planets:
    name = planet["name"]
    diameter = planet["diameter"]
    population = planet["population"]

    table.add_row(name, diameter, population)

console = Console()
console.print(table)