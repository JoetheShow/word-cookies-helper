class WordCookies {
  static localStorage;

  static initialize() {
    WordCookies.localStorage = window.localStorage;

    WordCookies.displayWords();
    WordCookies.initializeEvents();
  }

  static saveWord(word) {
    let words = WordCookies.savedWords();

    if(!words.includes(word)) {
      words.push(word);

      WordCookies.localStorage.setItem("savedWords", words.join(","));
    }
  }

  static removeWord(word) {
    let words = WordCookies.savedWords();

    if(words.includes(word)) {
      // words.push(word);
      let index = words.indexOf(word);
      words.splice(index, 1);

      WordCookies.localStorage.setItem("savedWords", words.join(","));
    }
  }

  static savedWords() {
    let words = WordCookies.localStorage.getItem("savedWords");

    if(words === null) {
      return [];
    } else {
      return words.split(",").sort();
    }
  }

  static clearSavedWords() {
    WordCookies.localStorage.removeItem("savedWords");
  }

  static availableLetters() {
    return $("#available-letters").val().split("");
  }

  static combinedLetters(letters, limit) {
    let combinations = [];

    for(let i = 0; i < letters.length; i++) {
      if(limit == 1) {
        combinations.push(letters[i]);
      } else {
        let lettersCopy = [...letters];
        lettersCopy.splice(i, 1);

        WordCookies.combinedLetters(lettersCopy, limit - 1).forEach(combination => {
          let concatCombination = letters[i].concat(combination)

          if(!combinations.includes(concatCombination)) {
            combinations.push(concatCombination);
          }
        });
      }
    }

    return combinations;
  }

  static allAvailableLeterCombinations() {
    let combinations = [];
    let letters = WordCookies.availableLetters();

    for(let characterLimit = 3; characterLimit <= letters.length; characterLimit++) {
      WordCookies.combinedLetters(letters, characterLimit).forEach(combination => {
        if(!combinations.includes(combination)) {
          combinations.push(combination)
        }
      });
    }

    return combinations;
  }

  static displayWords() {
    $(".saved-words-container").html("");

    WordCookies.savedWords().forEach(word => $(".saved-words-container").append(`<p>${word}</p>`))
  }

  static findKnownWords() {
    let count = 0;
    $(".known-words-container").html("");

    WordCookies.allAvailableLeterCombinations().sort().forEach(combination => {
      if(WordCookies.savedWords().includes(combination)) {
        count++;
        $(".known-words-container").append(`<p>${combination}</p>`);
      }
    });

    $("#known-words-count").html(count);
  }

  static initializeEvents() {
    // Removing a word
    $(".remove-word-button").click(function() {
      let word = $("input#remove-word").val();

      if(word != "") {
        WordCookies.removeWord(word);
        $("input#remove-word").val("");
        WordCookies.displayWords();
      }
    });

    // Removing all words
    $(".remove-all-words-button").click(function() {
      WordCookies.clearSavedWords();
      WordCookies.displayWords();
    });

    // Adding a word
    $(".add-word-button").click(function() {
      let word = $("input#add-word").val();

      if(word != "") {
        WordCookies.saveWord(word);
        $("input#add-word").val("");
        WordCookies.displayWords();
        WordCookies.findKnownWords();
      }
    });

    // Finding known words
    $(".find-known-words-button").click(function() {
      WordCookies.findKnownWords();
    });

    // Finding all available letter combinations
    $(".find-available-letter-combinations-button").click(function() {
      $(".all-available-letter-combinations-container").html("");

      let combinations = WordCookies.allAvailableLeterCombinations();

      combinations.forEach(combination => $(".all-available-letter-combinations-container").append(`<p>${combination} <button class="remove-combination">Remove</button></p>`))

      $("#available-combinations-count").html(combinations.length);
    });

    $("body").on("click", ".remove-combination", function() {
      $(this).closest("p").remove();
      $("#available-combinations-count").html($("#available-combinations-count").html() - 1);
    });
  }
}

WordCookies.initialize();
