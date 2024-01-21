use std::fs::File;
use std::io::Write;
use std::fmt::Write as FmtWrite;

enum Gender {

    Male,
    Female,

}

#[derive(Debug, PartialEq, Eq)]
enum FoodType {

    Frango,
    Ovo,
    Arroz,
    PaoIntegral,
    BananaPrata,
    Aveia,
    Alface,
    Azeite

}

impl FoodType {

    fn from_str(name: &str) -> Option<FoodType> {
        match name.to_lowercase().as_str() {
            "frango" => Some(FoodType::Frango),
            "ovo" => Some(FoodType::Ovo),
            "arroz" => Some(FoodType::Arroz),
            "pao_integral" => Some(FoodType::PaoIntegral),
            "Banana_prata" => Some(FoodType::BananaPrata),
            "aveia" => Some(FoodType::Aveia),
            "alface" => Some(FoodType::Alface),
            "azeite" => Some(FoodType::Azeite),
            _ => None,
        }
    }

}

#[derive(Debug)]
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
        let carbs_calories = (self.sugars + self.starches) * 4.0;
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

fn find_food_info<'a>(foods: &'a [Food], name: &str) -> Option<&'a Food> {
    FoodType::from_str(name)
        .and_then(|food_type| foods.iter().find(|food| food.food_type == food_type))
}

fn main() {

    let gender = Gender::Male;
    let age = 21;
    let weight = 68.0;
    let height = 163.0;

    let bmr_harris = harris_benedict_bmr(&gender, age, weight, height);
    let bmr_mifflin = mifflin_st_jeor_bmr(&gender, age, weight, height);

    println!("Metabolismo basal (Harris-Benedict): {:.2} calorias/dia", bmr_harris);
    println!("Metabolismo basal (Mifflin-St Jeor): {:.2} calorias/dia", bmr_mifflin);


    //100 gramas
    //food_type, sugars, fibers, starches, protein, fats
    let foods = vec![
        Food::new(FoodType::Frango, 0.0, 0.0, 1.3, 22.0, 1.0),
        Food::new(FoodType::Ovo, 0.0, 0.0, 1.2, 12.6, 10.0), //20 porções em 30 // porção 58g // 3 ovos 174g // 4 ovos 232g
        Food::new(FoodType::Arroz, 8.3, 2.1, 36.0, 4.1, 1.4),
        Food::new(FoodType::PaoIntegral, 0.0, 4.0, 68.0, 8.0, 0.4),
        Food::new(FoodType::Alface, 0.0, 1.83, 0.0, 1.35, 0.3),
        Food::new(FoodType::Azeite, 0.0, 0.0, 0.0, 0.0, 15.0),
    ];

    let apple = find_food_info(&foods, "Pao_integral");
    match apple {
        Some(food) => println!("Alimento encontrado: {:?} com {} calorias em 100 gramas", food, food.calories(100.0)),
        None => println!("Alimento não encontrado: maçã"),
    }





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
                <div class=\"content\" >
                    <h1>Resultado do Metabolismo Basal</h1>
                    <p>Metabolismo basal (Harris-Benedict): {:.2} calorias/dia</p>
                    <p>Metabolismo basal (Mifflin-St Jeor): {:.2} calorias/dia</p>
                    {}
                </div>
            </body>
        </html>", bmr_harris, bmr_mifflin, table_html)
        .unwrap();

    let mut file = File::create("bmr_result.html").unwrap();
    file.write_all(html_output.as_bytes()).unwrap();

    println!("O resultado foi salvo em bmr_result.html");

}

