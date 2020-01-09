use rand::Rng;

use std::collections::HashSet;
use std::convert::TryInto;

pub fn generate_tests(alphabet: HashSet<char>, length: u8, size: u8, random: bool) -> Vec<String> {
    let mut return_vec: Vec<String> = [].to_vec();

    return_vec.push("".to_string());

    let alphabet_vec: Vec<char> = alphabet.iter().cloned().collect();

    if random {
        while return_vec.len() < size.try_into().unwrap() {
            let mut rng = rand::thread_rng();

            let string_length: u8 = rng.gen_range(0, length);

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

        for i in 0..length {
            while return_vec[position].len() == usize::from(i) {
                let mut prefix = return_vec[position].to_owned();
                for letter in &alphabet_vec {
                    prefix.push(*letter);
                    return_vec.push(prefix.to_owned());
                    prefix.pop();
                }
                position += 1;
            }
        }
    }

    return_vec
}
