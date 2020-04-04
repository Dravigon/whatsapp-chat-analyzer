use regex::Regex;
use chrono::{Datelike, NaiveDateTime, Timelike};
use chrono::Duration;
use std::convert::TryInto;
use std::fmt::Write;
use std::cmp::Ordering;

use std::collections::HashMap;

extern crate console_error_panic_hook;
// The wasm-pack uses wasm-bindgen to build and generate JavaScript binding file.
// Import the wasm-bindgen crate. 
use wasm_bindgen::prelude::*;

// Our Add function
// wasm-pack requires "exported" functions 
// to include #[wasm_bindgen]
 
// Our function to concatenate the string "Wasm by Example"
// to the input string. We are using .into(), to convert
// the rust types of str to a String.
// 
const IGNORE_TEXTS: &str =r"(security code changed. Tap for more info|Messages to this chat and calls are now secured with end|Messages to this group are now secured with end| created group | added |changed to|Tap to|left$|<Media omitted>).*$"; 
const DATE_FORMAT:&str = r"^((\d{2}|\d{1})/(\d{2}|\d{1})/\d{2}, (\d{2}|\d{1}):\d{2}).*$";
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
    let reverse_regex = Regex::new(IGNORE_TEXTS).unwrap();
    let re = Regex::new(DATE_FORMAT).unwrap();
    for a in v{
         match re.is_match(a){
            true=>{
                let v: Vec<&str> = a.splitn(4, |c| c == '-' || c == ':').collect();
                let name = v[2].trim();
                if reverse_regex.is_match(name){
                    continue
                }
                if total_count.contains_key(name){
                    total_count.insert(name,total_count.get(name).unwrap()+1);
                }else{
                    total_count.insert(name,1);
                }

            },
            false=>{},
        }
    }
  let result = format!("{:?}", total_count);
  return result.replace("\\u","u").into();
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
    let reverse_regex = Regex::new(IGNORE_TEXTS).unwrap();
    for induvidual_para in para_list{
        if reverse_regex.is_match(induvidual_para){
            continue
        }
        let mut para:&str=induvidual_para;

        let re = Regex::new(DATE_FORMAT).unwrap();

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
//getting dateformat based on am pm
fn get_format(contains_am_pm:bool)->String{
    match contains_am_pm{
        true=>"%m/%d/%Y, %I:%M %p".to_string(),
        false=>"%d/%m/%Y, %H:%M".to_string()
    }
}

#[wasm_bindgen]
pub fn generate_heat_map_data(chat_data:String)->String{
    let mut values:HashMap<String, Vec<i32>> = HashMap::new();
    let para_list: Vec<&str> = chat_data.split("\n").collect();
    let re = Regex::new(DATE_FORMAT).unwrap();
    for induvidual_para in para_list{
        if re.is_match(induvidual_para){
                let para: Vec<&str> = induvidual_para.split(" - ").collect();
                let contains_am_pm:bool = para[0].trim().contains("PM")||para[0].trim().contains("AM");
                let no_timezone = NaiveDateTime::parse_from_str(para[0].trim(), &get_format(contains_am_pm)).unwrap();
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

#[wasm_bindgen]
pub fn generate_chat_history_data(chat_data:String)->String{
    console_error_panic_hook::set_once();
    let mut values:HashMap<String, Vec<u32>> = HashMap::new();
    let mut labels:Vec<String> = Vec::new();
    let para_list: Vec<&str> = chat_data.split("\n").collect();
    let re = Regex::new(DATE_FORMAT).unwrap(); 
    let reverse_regex = Regex::new(IGNORE_TEXTS).unwrap();
    
    let mut remember_times:HashMap<String, NaiveDateTime> = HashMap::new();
    let mut chat_start:NaiveDateTime = NaiveDateTime::parse_from_str("1995-01-01 00:00:00", "%Y-%m-%d %H:%M:%S").unwrap();
    let remember_time:NaiveDateTime = NaiveDateTime::parse_from_str("1995-01-01 00:00:00", "%Y-%m-%d %H:%M:%S").unwrap();
    let mut remember_name="";
    let mut remember_minute:HashMap<String,u32> = HashMap::new();
    for induvidual_para in para_list{
        if induvidual_para.trim()==""{
            continue
        }
      
        if !reverse_regex.is_match(induvidual_para){
         
            let mut para:&str=induvidual_para;
            let mut name = remember_name;
            let mut no_timezone = remember_time;
            if re.is_match(induvidual_para){
                let tmp:Vec<&str> = induvidual_para.splitn(3,":").collect();
                para=&tmp[2];
                let v: Vec<&str> = induvidual_para.splitn(4, |c| c == '-' || c == ':').collect();   
                name = v[2].trim();
                remember_name = name;
                let para: Vec<&str> = induvidual_para.split(" - ").collect();
                let contains_am_pm:bool = para[0].trim().contains("PM")||para[0].trim().contains("AM");
                no_timezone = NaiveDateTime::parse_from_str(para[0].trim(), &get_format(contains_am_pm)).unwrap();
                if chat_start.year()==1995{
                    chat_start=no_timezone.clone();
                }
                if remember_times.get(name)==None{
                    remember_times.insert(name.to_string(),no_timezone.clone());
                    remember_minute.insert(name.to_string(),no_timezone.minute());
                    let days_inactive = no_timezone.signed_duration_since(chat_start).num_days();
                    for x in 1..days_inactive{
                        let inactive_day = chat_start +  Duration::days(x);
                        let mut temp_day= String::new();
                        write!(temp_day,"{}-{}-{}",inactive_day.day(),inactive_day.month(),inactive_day.year());
                        let label_pos = labels.iter().position(|x| x == &temp_day);
                       match label_pos{
                            Some(_x)=>{},
                            None=>{
                                labels.push(temp_day);
                            }
                        }
                        let mut vec_data:Vec<u32> =
                        match values.get_mut(name){
                            Some(val)=>{
                                val.to_vec()
                            },
                            None=>{
                                Vec::new()
                                }
                            };
                        vec_data.push(0);
                        values.insert(name.to_string(),vec_data);
                    }
                    let mut vec_data:Vec<u32> =
                    match values.get_mut(name){
                        Some(val)=>{
                            val.to_vec()
                        },
                        None=>{
                            Vec::new()
                        }
                    };
                    let mut temp_day= String::new();
                    write!(temp_day,"{}-{}-{}",no_timezone.day(),no_timezone.month(),no_timezone.year());//must hadle error but nah
                    println!("{}",temp_day);
                    let label_pos = labels.iter().position(|x| x == &temp_day);
                    match label_pos{
                        Some(_x)=>{},
                        None=>{
                            labels.push(temp_day);
                            }
                    }
                    vec_data.push(0);
                    values.insert(name.to_string(),vec_data);
                }
            }else{
                no_timezone = *remember_times.get(name).unwrap();
            }
             println!("{} : {} - {} ",no_timezone,name,induvidual_para);
            let word_list:Vec<&str> = para.split(" ").collect();
            let word_count = word_list.len() as u32;
       
 
                let mut month_year =String::new();
                write!(month_year,"{}-{}-{}",no_timezone.day(),no_timezone.month(),no_timezone.year());//must hadle error but nah
                let label_pos = labels.iter().position(|x| x == &month_year);
                match label_pos{
                    Some(pos)=>{
                            let mut vec:Vec<u32> = values.get_mut(name).unwrap().to_vec();
                            let monthly_chat_count = vec.get(pos);
                            let new_monthly_chat_count_list = match monthly_chat_count{
                                Some(value)=>{
                                        println!("{} {:?} ---",name,values.get(name));
                                        let new_value = value+word_count;
                                        vec.push(new_value);
                                        vec.swap_remove(pos);
                                        vec
                                },
                                None=>{
                                    //println!("{} new",para[0].trim());
                                    let days_inactive = no_timezone.signed_duration_since(*remember_times.get(name).unwrap()).num_days();
                                    println!("{} {:?} {} has value",name,values.get(name),days_inactive);
                                    for _x in 1..days_inactive{
                                        vec.push(0);
                                    }
                                    vec.push(word_count);
                                    vec
                                }
                            };
                            values.insert(name.to_string(),new_monthly_chat_count_list);
                    },
                    None=>{
                        //push data

                            let days_inactive = no_timezone.signed_duration_since(*remember_times.get(name).unwrap()).num_days();
                      
                            for x in 1..days_inactive{
                            println!("re {}",*remember_times.get(name).unwrap());
                                let inactive_day = *remember_times.get(name).unwrap() +  Duration::days(x );
                                let mut temp_day= String::new();
                                write!(temp_day,"{}-{}-{}",inactive_day.day(),inactive_day.month(),inactive_day.year());//must hadle error but nah
                                println!("{}",temp_day);
                                let label_pos = labels.iter().position(|x| x == &temp_day);
                                match label_pos{
                                    Some(_x)=>{},
                                    None=>{
                                        labels.push(temp_day);
                                    }
                                }

                                let mut vec_data:Vec<u32> =
                                match values.get_mut(name){
                                    Some(val)=>{
                                        val.to_vec()
                                    },
                                    None=>{
                                        Vec::new()
                                    }
                                };
                                vec_data.push(0);
                                values.insert(name.to_string(),vec_data);
                            }
                        
                        remember_minute.insert(name.to_string(),no_timezone.minute());
                        
                       let label_pos = labels.iter().position(|x| x == &month_year);
                       match label_pos{
                            Some(_x)=>{},
                            None=>{
                                labels.push(month_year);
                            }
                        }
                        let mut vec_data:Vec<u32> =
                        match values.get_mut(name){
                            Some(val)=>{
                                val.to_vec()
                            },
                            None=>{
                                Vec::new()
                            }
                        };
                        if vec_data.is_empty(){
                             vec_data = vec![word_count];
                        }else{
                            vec_data.push(word_count);
                        }
                        values.insert(name.to_string(),vec_data);
                          println!("{} {:?} {}",name,values.get(name),days_inactive);
                    }
                    
                }
                remember_times.insert(name.to_string(),no_timezone.clone());
        }
    }
    format!("{{\"labels\":{:?},\"values\":{:?}}}",labels,values).replace("\\u","u")
}
#[wasm_bindgen]
pub fn generate_chat_frequency_data(chat_data:String)->String{
    let mut values:HashMap<String, Vec<u32>> = HashMap::new();
    let mut labels:Vec<String> = Vec::new();
    let para_list: Vec<&str> = chat_data.split("\n").collect();
    let re = Regex::new(DATE_FORMAT).unwrap(); 
    let reverse_regex = Regex::new(IGNORE_TEXTS).unwrap();
    
    let mut remember_times:HashMap<String, NaiveDateTime> = HashMap::new();
    let mut chat_start:NaiveDateTime = NaiveDateTime::parse_from_str("1995-01-01 00:00:00", "%Y-%m-%d %H:%M:%S").unwrap();
    let remember_time:NaiveDateTime = NaiveDateTime::parse_from_str("1995-01-01 00:00:00", "%Y-%m-%d %H:%M:%S").unwrap();
    let mut remember_name="";
    let mut remember_minute:HashMap<String,u32> = HashMap::new();
    for induvidual_para in para_list{
        if induvidual_para.trim()==""{
            continue
        }
      
        if !reverse_regex.is_match(induvidual_para){
         
            let mut para:&str=induvidual_para;
            let mut name = remember_name;
            let mut no_timezone = remember_time;
            if re.is_match(induvidual_para){
                let tmp:Vec<&str> = induvidual_para.splitn(3,":").collect();
                para=&tmp[2];
                let v: Vec<&str> = induvidual_para.splitn(4, |c| c == '-' || c == ':').collect();   
                name = v[2].trim();
                remember_name = name;
                let para: Vec<&str> = induvidual_para.split(" - ").collect();
                let contains_am_pm:bool = para[0].trim().contains("PM")||para[0].trim().contains("AM");
                no_timezone = NaiveDateTime::parse_from_str(para[0].trim(), &get_format(contains_am_pm)).unwrap();
                if chat_start.year()==1995{
                    chat_start=no_timezone.clone();
                }
                if remember_times.get(name)==None{
                
                    remember_times.insert(name.to_string(),no_timezone.clone());
                    remember_minute.insert(name.to_string(),no_timezone.minute());
                    let days_inactive = no_timezone.signed_duration_since(chat_start).num_days();
                    for x in 1..days_inactive{
                        let inactive_day = chat_start +  Duration::days(x);
                        let mut temp_day= String::new();
                        write!(temp_day,"{}-{}-{}",inactive_day.day(),inactive_day.month(),inactive_day.year());
                        let label_pos = labels.iter().position(|x| x == &temp_day);
                       match label_pos{
                            Some(_x)=>{},
                            None=>{
                                labels.push(temp_day);
                            }
                        }
                        let mut vec_data:Vec<u32> =
                        match values.get_mut(name){
                            Some(val)=>{
                                val.to_vec()
                            },
                            None=>{
                                Vec::new()
                                }
                            };
                        vec_data.push(0);
                        values.insert(name.to_string(),vec_data);
                    }
                    let mut vec_data:Vec<u32> =
                    match values.get_mut(name){
                        Some(val)=>{
                            val.to_vec()
                        },
                        None=>{
                            Vec::new()
                        }
                    };
                    let mut temp_day= String::new();
                    write!(temp_day,"{}-{}-{}",no_timezone.day(),no_timezone.month(),no_timezone.year());//must hadle error but nah
                    println!("{}",temp_day);
                    let label_pos = labels.iter().position(|x| x == &temp_day);
                    match label_pos{
                        Some(_x)=>{},
                        None=>{
                            labels.push(temp_day);
                            }
                    }
                    vec_data.push(0);
                    values.insert(name.to_string(),vec_data);
                    println!("{:?} {}",values,name);
                }
            }else{
                no_timezone = *remember_times.get(name).unwrap();
            }
             println!("{} : {} - {} ",no_timezone,name,induvidual_para);
            let word_list:Vec<&str> = para.split(" ").collect();
            let word_count = word_list.len() as u32;
       
 
                let mut month_year =String::new();
                write!(month_year,"{}-{}-{}",no_timezone.day(),no_timezone.month(),no_timezone.year());//must hadle error but nah
                let label_pos = labels.iter().position(|x| x == &month_year);
                match label_pos{
                    Some(pos)=>{
                            println!("{:?} {}",values,name);
                            let mut vec:Vec<u32> = values.get_mut(name).unwrap().to_vec();
                            let monthly_chat_count = vec.get(pos);
                            let new_monthly_chat_count_list = match monthly_chat_count{
                                Some(value)=>{
                                        if(*remember_minute.get(name).unwrap()==no_timezone.minute()){
                                            let new_value = value+word_count;
                                            vec.push(new_value);
                                            vec.swap_remove(pos);
                                            vec
                                        }else{
                                            let new_value = if(value>&word_count) {value} else {&word_count};
                                            vec.push(*new_value);
                                            vec.swap_remove(pos);
                                            vec
                                        }
                                },
                                None=>{
                                    //println!("{} new",para[0].trim());
                                    let days_inactive = no_timezone.signed_duration_since(*remember_times.get(name).unwrap()).num_days();
                                    println!("{} {:?} {} has value",name,values.get(name),days_inactive);
                                    for _x in 1..days_inactive{
                                        vec.push(0);
                                    }
                                    vec.push(word_count);
                                    vec
                                }
                            };
                            values.insert(name.to_string(),new_monthly_chat_count_list);
                    },
                    None=>{
                        //push data

                            let days_inactive = no_timezone.signed_duration_since(*remember_times.get(name).unwrap()).num_days();
                      
                            for x in 1..days_inactive{
                            println!("re {}",*remember_times.get(name).unwrap());
                                let inactive_day = *remember_times.get(name).unwrap() +  Duration::days(x );
                                let mut temp_day= String::new();
                                write!(temp_day,"{}-{}-{}",inactive_day.day(),inactive_day.month(),inactive_day.year());//must hadle error but nah
                                println!("{}",temp_day);
                                let label_pos = labels.iter().position(|x| x == &temp_day);
                                match label_pos{
                                    Some(_x)=>{},
                                    None=>{
                                        labels.push(temp_day);
                                    }
                                }

                                let mut vec_data:Vec<u32> =
                                match values.get_mut(name){
                                    Some(val)=>{
                                        val.to_vec()
                                    },
                                    None=>{
                                        Vec::new()
                                    }
                                };
                                vec_data.push(0);
                                values.insert(name.to_string(),vec_data);
                            }
                        
                        remember_minute.insert(name.to_string(),no_timezone.minute());
                        
                       let label_pos = labels.iter().position(|x| x == &month_year);
                       match label_pos{
                            Some(_x)=>{},
                            None=>{
                                labels.push(month_year);
                            }
                        }
                        let mut vec_data:Vec<u32> =
                        match values.get_mut(name){
                            Some(val)=>{
                                val.to_vec()
                            },
                            None=>{
                                Vec::new()
                            }
                        };
                        if vec_data.is_empty(){
                             vec_data = vec![word_count];                        
                        }else{
                            vec_data.push(word_count);
                        }
                        values.insert(name.to_string(),vec_data);
                       
                    }
                    
                }
                remember_times.insert(name.to_string(),no_timezone.clone());
        }
    }
    format!("{{\"labels\":{:?},\"values\":{:?}}}",labels,values).replace("\\u","u")
}
