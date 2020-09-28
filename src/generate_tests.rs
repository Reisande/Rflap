use rand::Rng;

use std::collections::HashSet;
use std::convert::TryInto;

use serde::{Deserialize, Serialize};
use serde_json::Result;

#[derive(Debug, Deserialize)]
pub struct TestsJson {
    pub alphabet: HashSet<char>,
    pub length: u16, // longest string
    pub size: u16,   // how many strings
    pub random: bool,
}

#[derive(Debug, Serialize)]
pub struct TestsJsonCallback {
    pub return_vec: Vec<String>,
}

pub fn generate_tests(input_json: TestsJson) -> TestsJsonCallback {
    let mut return_vec: Vec<String> = [].to_vec();

    let alphabet_vec: Vec<char> = input_json.alphabet.iter().cloned().collect();

    if input_json.random {
        while return_vec.len() < input_json.size.try_into().unwrap() {
            let mut rng = rand::thread_rng();

            let string_length: u16 = rng.gen_range(7, 7 + input_json.length);

            let new_test_string: String = (0..string_length)
                .map(|_| {
                    let idx: usize = rng.gen_range(0, alphabet_vec.len()).try_into().unwrap();
                    alphabet_vec[idx] as char
                })
                .collect();

            return_vec.push(new_test_string);
        }
    } else {
        let mut position: usize = 0;
		return_vec.push("".to_string());
		while (return_vec.len() as u16) < input_json.size {
			for mut i in 0..input_json.length {
				while return_vec[position].len() == usize::from(i) {
					let mut prefix = return_vec[position].to_owned();
					for letter in &alphabet_vec {
						prefix.push(*letter);
						if !return_vec.contains(&prefix.to_owned()) {
							return_vec.push(prefix.to_owned());
							if return_vec.len() as u16 >= input_json.size {
								println!("break: {} {} end", return_vec.len(), input_json.size);
								return TestsJsonCallback {
									return_vec: return_vec,
								};
							}
							i -= 1;
						}
						prefix.pop();
					}
					position += 1;
				}
				
				if return_vec.len() as u16 >= input_json.size {
					break;
				}
			}
		}
    }

    TestsJsonCallback {
        return_vec: return_vec,
    }
}
