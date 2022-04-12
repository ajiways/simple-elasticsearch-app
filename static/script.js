const productsContainer = document.querySelector('.products');
const suggestionContainer = document.querySelector('.suggestions');
const suggestionsList = document.querySelector('.suggestions__items');
const searchInput = document.querySelector('#search');

function handleTyping() {
  const searchDebaunced = debounce(search, 1000);
  let prevValue = '';
  searchInput.addEventListener('keyup', function (event) {
    if (prevValue != event.target.value) {
      searchDebaunced(event.target.value);
      prevValue = event.target.value;
    }
  });
}

function debounce(cb, duration) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      cb(...args);
    }, duration);
  };
}

function search(searchValue) {
  fetch(`/search?search=${searchValue}`, { method: 'GET' })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data.hits.hits);
      const prods = data.hits.hits.map((el) => el._source);
      const suggestions = data.suggest.simple_phrase;
      drawSuggestion(suggestions);
      handleSuggestionClick();
      drawProducts(prods);
    });
}

function drawProducts(products) {
  const result = products
    .map((product) => {
      const template = `
      <div class="card product">
        <h3>${product.name}</h3>
        <p>
          Цена: ${product.price}
        </p>
      </div>
    `;
      return template;
    })
    .join('');
  productsContainer.innerHTML = result;
}

function handleSuggestionClick() {
  document.querySelectorAll('.suggested').forEach((element) => {
    element.addEventListener('click', function () {
      const suggestion = this.getAttribute('data-suggestion');
      searchInput.value = suggestion;
      search(suggestion);
    });
  });
}

function drawSuggestion(suggestions) {
  let options = [];
  suggestions.forEach((el) => {
    const templated = el.options.map((opt) => {
      const optResult = `
        <li >
          <a class='suggested' href='#' data-suggestion='${opt.text}'>${opt.highlighted}</a>
        </li>
      `;
      return optResult;
    });

    if (templated.length > 0) {
      options.push(templated.join('<li> или </li>'));
    }
  });

  suggestionsList.innerHTML = options;
  if (options.length > 0) {
    suggestionContainer.classList.add('visible');
  } else {
    suggestionContainer.classList.remove('visible');
  }
}

handleTyping();
