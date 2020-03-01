use regex::Regex;
use chrono::{Datelike, NaiveDateTime, Timelike};
use std::convert::TryInto;
use std::fmt::Write;
use std::cmp::Ordering;

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
#[wasm_bindgen]
pub fn count_words(msg: String,pronoun:String)->String{
    #[derive( Debug)]
    struct Entry {
        word: String,
        freq: f32,
    }
    impl Entry {
        fn new(x: String, y: f32) -> Entry {
            Entry { word:x, freq:y }
        }
    }

    let mut word_count:HashMap<&str, f32> = HashMap::new();
    let mut max_count:f32 = 1.0;
    let mut total_count:f32 = 0.0;
    let mut unique_word_count:f32 = 0.0;
    let para_list: Vec<&str> = msg.split("\n").collect();
    let pronoun_list:Vec<&str>=pronoun.split(",").collect();
    let reverse_regex = Regex::new("(security code changed. Tap for more info|Messages to this chat and calls are now secured with end|<Media).*$").unwrap();
    for induvidual_para in para_list{
        if reverse_regex.is_match(induvidual_para){
            continue
        }
        let mut para:&str=induvidual_para;
        let re = Regex::new(r"^\d{2}/\d{2}/\d{2}, \d{2}:\d{2}.*$").unwrap();

        if re.is_match(para){
            let tmp:Vec<&str> = para.splitn(3,":").collect();
            para=&tmp[2];
        }
        let word_list:Vec<&str> = para.split(" ").collect();
        for word in word_list{
            //ignore whitespaces and one letter words
                if word.trim().len()<2{
                    continue;
                }
                let word_lower = word.to_lowercase();
                match !pronoun_list.contains(&word_lower.as_str()){
                    true=>{
                            total_count = total_count+1.0;
                            if word_count.contains_key(word){
                                  let current_count = *word_count.get(word).unwrap();
                                  if current_count>max_count{
                                      max_count=current_count;
                                  }
                                  word_count.insert(word,current_count+1.0);
                            }else{
                                    word_count.insert(word,1.0);
                                    unique_word_count=unique_word_count+1.0;
                            }
                        },
                    false=>{},
                }
            }
    }
    let mut word_frequency_list:Vec<Entry> = vec![];
    let margin = (max_count+total_count/unique_word_count)*max_count/total_count;

    for (word_key,count) in word_count.iter(){
        if count<&margin{
            continue
        }
        let freq:f32 = (count - margin)/(max_count - margin);
        let word = word_key.to_string();

        word_frequency_list.push(Entry::new(word,freq));
    }
    word_frequency_list.sort_by(|a, b| b.freq.partial_cmp(&a.freq).unwrap_or(Ordering::Equal));
    word_frequency_list.truncate(25);
    let result = format!("{:?}",word_frequency_list).replace("Entry","").replace("word:","\"word\":").replace("freq:","\"freq\":");
    return result.replace("\\\'", "`").replace("\\u","u");
}

#[wasm_bindgen]
pub fn generate_heat_map_data(chat_data:String)->String{
    let mut values:HashMap<String, Vec<i32>> = HashMap::new();
    let para_list: Vec<&str> = chat_data.split("\n").collect();
    let re = Regex::new(r"^\d{2}/\d{2}/\d{2}, \d{2}:\d{2}.*$").unwrap(); 
    for induvidual_para in para_list{
        if re.is_match(induvidual_para){
                let para: Vec<&str> = induvidual_para.split(" - ").collect();
                let no_timezone = NaiveDateTime::parse_from_str(para[0].trim(), "%d/%m/%Y, %H:%M").unwrap();
                let mut week_day =String::new();
                write!(week_day,"{:?}",no_timezone.weekday());//must hadle error but nah
                if values.contains_key(&week_day){
                    let mut vec:Vec<i32> = values.get_mut(&week_day).unwrap().to_vec();
                    let hour:usize = no_timezone.hour().try_into().unwrap(); 
                    vec[hour]=vec[hour]+1;
                    values.insert(week_day,vec);
                }else{
                    let mut vec:Vec<i32> = vec![0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];                    
                    let hour:usize = no_timezone.hour().try_into().unwrap(); 
                    vec[hour]=1;
                    values.insert(week_day,vec);
                }
        }
    }
    format!("{:?}",values)
}
