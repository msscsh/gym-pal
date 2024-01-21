use std::fs::File;
use std::io::Write;
use std::fmt::Write as FmtWrite;
use std::fmt;

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

fn generate_html_table_for_foods(foods: &[Food]) -> String {
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

struct DietItem<'a> {

    mealType: MealType,
    wichFood: &'a Food,
    grams: f64,

}

impl DietItem<'_> {

    fn new<'a>(mealType: MealType, wichFood: &'a Food, grams: f64) -> DietItem<'a> {
        DietItem { mealType, wichFood, grams }
    }

}

enum MealType {

    Breakfast,
    Lunch,
    Snack,
    Dinner,

}
impl fmt::Display for MealType {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", match self {
            MealType::Breakfast => "Café da Manhã",
            MealType::Lunch => "Almoço",
            MealType::Snack => "Lanche",
            MealType::Dinner => "Jantar",
        })
    }
}

struct Diet<'a> {

    breakfast: Vec<DietItem<'a>>,
    lunch: Vec<DietItem<'a>>,
    snack: Vec<DietItem<'a>>,
    dinner: Vec<DietItem<'a>>

}

impl<'a> Diet<'a> {

    fn addDietMeal(&mut self, mealType: MealType, wichFood: &'a Food, grams: f64) {
        match mealType {
            MealType::Breakfast => {
                self.breakfast.push(DietItem::new(mealType, wichFood, grams));
            }
            MealType::Lunch => {
                self.lunch.push(DietItem::new(mealType, wichFood, grams));
            }
            MealType::Snack => {
                self.snack.push(DietItem::new(mealType, wichFood, grams));
            }
            MealType::Dinner => {
                self.dinner.push(DietItem::new(mealType, wichFood, grams));
            }
        }
    }

}

fn generate_html_table_for_diet(dietItens: Vec<DietItem>) -> String {
    let mut table_html = String::from(format!("<table class=\"smallTable\">
        <thead>
            <tr>
                <th colspan=\"3\" style=\"text-align: center;\">{}</th>
            </tr>
            <tr>
                <th>Alimento</th>
                <th>Quantidade(g)</th>
                <th>Calorias</th>
            </tr>
        </thead>", &dietItens[0].mealType));

    for dietItem in dietItens {
        let row = format!("<tr>
                <td>{:?}</td>
                <td>{}</td>
                <td>{}</td>
            </tr>", 
            dietItem.wichFood.food_type, dietItem.grams, dietItem.wichFood.calories(100.0));
        table_html.push_str(&row);
    }

    table_html.push_str("</table>");
    table_html
}

fn main() {

    let gender = Gender::Male;
    let age = 35;
    let weight = 78.0;
    let height = 177.0;

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

    let eggs = find_food_info(&foods, "Ovo").unwrap();

    let mut diet = Diet { breakfast:vec![], lunch:vec![], snack:vec![], dinner:vec![] };
    diet.addDietMeal(MealType::Breakfast, eggs, 100.0);
    diet.addDietMeal(MealType::Lunch, eggs, 200.0);
    diet.addDietMeal(MealType::Snack, eggs, 300.0);
    diet.addDietMeal(MealType::Dinner, eggs, 400.0);

    let table_html_foods = generate_html_table_for_foods(&foods);
    let table_html_diet_breakfast = generate_html_table_for_diet(diet.breakfast);
    let table_html_diet_lunch = generate_html_table_for_diet(diet.lunch);
    let table_html_diet_snack = generate_html_table_for_diet(diet.snack);
    let table_html_diet_dinner = generate_html_table_for_diet(diet.dinner);

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
                    {}
                    {}
                    {}
                    {}
                </div>
            </body>
        </html>", bmr_harris, bmr_mifflin, table_html_foods, table_html_diet_breakfast, table_html_diet_lunch, table_html_diet_snack, table_html_diet_dinner)
        .unwrap();

    let mut file = File::create("bmr_result.html").unwrap();
    file.write_all(html_output.as_bytes()).unwrap();

    println!("O resultado foi salvo em bmr_result.html");

}

