use std::fs::File;
use std::io::Write;
use std::fmt::Write as FmtWrite;

enum Gender {

    Male,
    Female,

}

#[derive(Debug)]
enum FoodType {

    Apple,

}

struct Food {

    food_type: FoodType,
    sugars: f64,
    fibers: f64,
    starches: f64,
    protein: f64,
    fats: f64,

}

impl Food {

    fn new(food_type: FoodType, sugars: f64, fibers: f64, starches: f64, protein: f64, fats: f64) -> Food {
        Food { food_type, sugars, fibers, starches, protein, fats }
    }

    fn total_carbs(&self) -> f64 {
        self.sugars + self.fibers + self.starches
    }

    fn calories(&self, grams: f64) -> f64 {
        let carbs_calories = (self.sugars + self.starches) * 4.0; // Supondo que as fibras não contribuem tanto para as calorias
        let protein_calories = self.protein * 4.0;
        let fat_calories = self.fats * 9.0;

        (carbs_calories + protein_calories + fat_calories) * grams / 100.0
    }

}

fn harris_benedict_bmr(gender: &Gender, age: u32, weight_kg: f64, height_cm: f64) -> f64 {

    match gender {
        Gender::Male => {
            88.362 + (13.397 * weight_kg) + (4.799 * height_cm) - (5.677 * age as f64)
        }
        Gender::Female => {
            447.593 + (9.247 * weight_kg) + (3.098 * height_cm) - (4.330 * age as f64)
        }
    }

}

fn mifflin_st_jeor_bmr(gender: &Gender, age: u32, weight_kg: f64, height_cm: f64) -> f64 {

    match gender {
        Gender::Male => {
            (10.0 * weight_kg) + (6.25 * height_cm) - (5.0 * age as f64) + 5.0
        }
        Gender::Female => {
            (10.0 * weight_kg) + (6.25 * height_cm) - (5.0 * age as f64) - 161.0
        }
    }

}

fn generate_html_table(foods: &[Food]) -> String {
    let mut table_html = String::from("<table>
        <tr>
            <th>Alimento</th>
            <th>Açúcares (g)</th>
            <th>Fibras (g)</th>
            <th>Amidos (g)</th>
            <th>Proteínas (g)</th>
            <th>Gorduras (g)</th>
            <th>Calorias por 100g</th>
        </tr>");

    for food in foods {
        let row = format!("<tr>
                <td>{:?}</td>
                <td>{}</td>
                <td>{}</td>
                <td>{}</td>
                <td>{}</td>
                <td>{}</td>
                <td>{}</td>
            </tr>", 
            food.food_type, food.sugars, food.fibers, food.starches, food.protein, food.fats, food.calories(100.0));
        table_html.push_str(&row);
    }

    table_html.push_str("</table>");
    table_html
}

fn main() {

    let gender = Gender::Male;
    let age = 30;
    let weight = 75.0;
    let height = 173.0;

    let bmr_harris = harris_benedict_bmr(&gender, age, weight, height);
    let bmr_mifflin = mifflin_st_jeor_bmr(&gender, age, weight, height);

    println!("Metabolismo basal (Harris-Benedict): {:.2} calorias/dia", bmr_harris);
    println!("Metabolismo basal (Mifflin-St Jeor): {:.2} calorias/dia", bmr_mifflin);

    let foods = vec![
        Food::new(FoodType::Apple, 15.0, 2.4, 7.6, 0.5, 0.3),
    ];

    println!("Calorias em 100 gramas de maçã: {} calorias", &foods[0].calories(100.0));

    let table_html = generate_html_table(&foods);

    let mut html_output = String::new();
    write!(&mut html_output,
        "<!DOCTYPE html>
        <html lang=\"en\">
            <head>
                <meta charset=\"UTF-8\">
                <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
                <title>Resultado do Metabolismo Basal</title>
                <link rel=\"stylesheet\" href=\"style.css\">
            </head>
            <body>
                <h1>Resultado do Metabolismo Basal</h1>
                <p>Metabolismo basal (Harris-Benedict): {:.2} calorias/dia</p>
                <p>Metabolismo basal (Mifflin-St Jeor): {:.2} calorias/dia</p>
                {}
            </body>
        </html>", bmr_harris, bmr_mifflin, table_html)
        .unwrap();

    let mut file = File::create("bmr_result.html").unwrap();
    file.write_all(html_output.as_bytes()).unwrap();

    println!("O resultado foi salvo em bmr_result.html");

}

