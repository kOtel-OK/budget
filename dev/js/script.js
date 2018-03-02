//BUDGET CONTROLLER
let budgetController = (function(){

	class Expense {
		constructor(id, description, value) {
			this.id = id;
			this.description = description;
			this.value = value;
		}


	}

	class Income {
		constructor(id, description, value) {
			this.id = id;
			this.description = description;
			this.value = value;
		}
	}

	let data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0
	};

	return {
		addItem(type, des, val) {
			let newItem,
			   	arr,
					ID;

			arr = data.allItems[type];
			// ID = arr.indexOf(arr[arr.length - 1]) + 1; // создаем ID для передачи в конструктор
			                                           // берем индекс последнего эл. в массиве и
			                                           // добавляем 1

			if (arr.length > 0) {
				ID = arr[arr.length - 1].id + 1; //id - ключ объекта в предыдущем элементе массива
			} else {
				ID = 0;  //в массиве ничего нет, соответсвенно нет объекта с ключем id
			}
      // create new item based on 'exp' or 'inc' type
			if (type === 'exp') {
				newItem = new Expense(ID, des, val);
			} else if (type === 'inc') {
				newItem = new Income(ID, des, val);
			}
       // push it in our data structure
			data.allItems[type].push(newItem);
      // return new element
			return newItem;
		},
		calculateBudget(type, val) {
			// 1. Calculate sum of income and expenses
				data.totals[type] += val;

			// 2. Calculate the budget: income - expenses
        data.budget = data.totals.inc - data.totals.exp;
			// 3. Calculate the percentage that we spent
		},
		getData() {  //TODO delete method
			return data;
		}
	}
  
}());


//UI CONTROLLER
let UIController = (function(){
  let DOMStrings = {  //собираем все используемые элементы DOM вместе в виде объекта
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
		    listInc: '.income__list',
		    listExp: '.expenses__list'
  };
  return {
    getInput() {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value) // Поле с ценой приводим к числу
      };
    },
		getDOMStrings() {  // делаем доступным объект с элементами DOM, возвращая его публичным методом
      return DOMStrings;
    },
		addListItem(obj, type) {
			// Create HTML string with placeholder text
			let html, element;

			if (type === 'inc') {
				element = DOMStrings.listInc;
				// Replace the placeholder text with some actual data
				//newHtml = html.replace('%id%', obj.id); // Можно заменить плейсхолдеры методом .replace()
				html = `<div class="item clearfix" id="income-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix"><div class="item__value">${obj.value}</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>`;
			} else if (type === 'exp') {
				element = DOMStrings.listExp;
				html = `<div class="item clearfix" id="expense-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix"><div class="item__value">${obj.value}</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
			}
			// Insert HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', html);
		},
		clearFields() {  // Очищаем поля после ввода
    	let fields,
				  fieldsArray;

    	fields = document.querySelectorAll(`${DOMStrings.inputDescription}, ${DOMStrings.inputValue}`);

    	fieldsArray = Array.prototype.slice.call(fields);

    	fieldsArray.forEach(el => el.value = '');

    	fieldsArray[0].focus();  // Возвращаем фокус на первое поле
		}
  };
  
}());


//GLOBAL APP CONTROLLER
let controller = (function(budgetCtrl, UIctrl){  // имена для переданных в кач-ве аргументов модулей

  let setupEventListeners = function() { //собираем eventListeners вместе, это точка входа в приложение
		let DOM = UIctrl.getDOMStrings(); // получаем из UIController возвр. значения getDOMStrings и присваеваем их DOM

		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem); // вешаем событие клик на кнопку

		document.addEventListener('keypress', function (event) { // вешаем событие нажатия клавиши на весь документ
			if (event.keyCode === 13 || event.which === 13) {  // только при нажатии на "ENTER"
				ctrlAddItem(); // вызываем обработчик
			}
		});
  };

  let updateBudget = function() {
		let input;

		input = UIctrl.getInput();
		// 1 Calculate the budget (method in the budgetController)
		budgetCtrl.calculateBudget(input.type, input.value);

		// 2. Return the budget (method in the budgetController)

		// 3. Display the budget on the UI (method in the UIController)
	};

  let ctrlAddItem = function() {  // функция - обработчик вызываемая при клике или нажатии и запускающая все приложение
		let input,
				newItem;

			// 1. Get the field input data
    input = UIctrl.getInput(); // выполняем публичный метод возвр. объекта UIController. Получаем данные полей и
		                               // записываем результат в input

		if (input.description !== '' && !isNaN(input.value) && input.value > 0 ) {  //Check inputs for empty and invalid
			// values

		// 2. Add the item to budget controller
		newItem = budgetCtrl.addItem(input.type, input.description, input.value);
		console.log(newItem, budgetCtrl.getData());  //TODO удалить console.log

		// 3. Add the item to the UI
		UIctrl.addListItem(newItem, input.type);

			// 4. Calculate and update budget
			updateBudget();

		// 5. Clear input fields
		UIctrl.clearFields();



		}
  };

return {
  init() {
    setupEventListeners(); //
  }
};

}(budgetController, UIController)); // Передаем в controller в кач-ве аргументов остальные модули
                                    // теперь он может к ним обращаться

controller.init(); // запуском метода init инициализируем приложение