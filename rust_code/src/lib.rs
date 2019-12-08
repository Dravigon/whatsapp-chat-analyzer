use regex::Regex;
use std::collections::HashMap;
// The wasm-pack uses wasm-bindgen to build and generate JavaScript binding file.
// Import the wasm-bindgen crate. 
use wasm_bindgen::prelude::*;

// Our Add function
// wasm-pack requires "exported" functions 
// to include #[wasm_bindgen]
 
// Our function to concatenate the string "Wasm by Example"
// to the input string. We are using .into(), to convert
// the rust types of str to a String.
#[wasm_bindgen]
pub fn add_wasm_by_example_to_string(input_string: String) -> String {
  let result = format!("{} {}", input_string, "Wasm by Example");
  return result.into();
}

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    return a + b;
}
#[wasm_bindgen]
pub fn count_user_msg(msg: String)->String{
    let mut total_count:HashMap<&str, i32> = HashMap::new();
    let v: Vec<&str> = msg.split("\n").collect();
    let reverse_regex = Regex::new("(security code changed. Tap for more info|Messages to this chat and calls are now secured with end).*$").unwrap();
    let re = Regex::new(r"^\d{2}/\d{2}/\d{2}, \d{2}:\d{2}.*$").unwrap();
    for a in v{
         match re.is_match(a)&!reverse_regex.is_match(a){
            true=>{
                let v: Vec<&str> = a.splitn(4, |c| c == '-' || c == ':').collect();
                let name = v[2].trim();
                if total_count.contains_key(name){
                    total_count.insert(name,total_count.get(name).unwrap()+1);
                }else{
                    total_count.insert(name,1);
                }

            },
            false=>{},
        }
    }
    //format!("{:?}",total_count);
  let result = format!("{:?}", total_count);
  return result.into();
}
