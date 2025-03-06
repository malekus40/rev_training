// Import the readline module for handling user input in the console
// const readline = require('readline');
import readline from 'readline';

let listOfGroceries = [];


const rl = readline.createInterface({
  input: process.stdin, // Read from standard input (keyboard)
  output: process.stdout // Write to standard output (console)
});

function displayMenu() {
    console.log('\nGrocery Shopping Tracker');
    console.log('1. View Grocery List');
    console.log('2. Add Item');
    console.log('3. Remove Item');
    console.log('4. Mark Item as Bought');
    console.log('5. Exit');
    rl.question('Choose an option: ', (choice) => {
      handleMenuChoice(choice);
    });
}

//Print all the items added to the list
let viewGroceryList = () => {
    console.log('\nGrocery List:')
    if (listOfGroceries.length === 0){
        console.log('Your list is empty');
    }
    console.log('\nNo.   Name                Quantity   Price   Status');
    console.log('---------------------------------------------------');
    listOfGroceries.forEach((grocery, itemNumber) =>
         console.log(`${String(itemNumber+1).padEnd(5)} ${grocery.name.padEnd(20)} ${String(grocery.quantity).padEnd(9)} $${String(grocery.price).padEnd(7)} ${grocery.bought ? 'Bought' : 'Not Bought'} `))
   
}

//Adding items to the list
let addItem = () => {  
    rl.question('Enter item name:', (name) => {
        rl.question('Enter quantity: ', (quantity) => {
            rl.question('Enter price: ', (price) => {
                listOfGroceries.push({name, quantity: Number(quantity), price: Number(price), bought: false});
                console.log(`Item was added to the list`);
                displayMenu();
            })
        })
    
    });

}
//Remove an item from the list
let removeItem = () => {
    viewGroceryList();
    if (listOfGroceries.length === 0) {
        console.log('No items in the list');
        displayMenu();
    }else {
        rl.question('Enter item number to remove: ', (index) => {
            if (index - 1 >= 0 && index - 1 <= listOfGroceries.length){
                
                listOfGroceries.splice(index - 1, 1);
                console.log('An item was removed')
            }
            else {
                console.log('Invalid item number');
            }
            displayMenu();
        })
    }
    

}

let markItemAsBought = () => {
    viewGroceryList();
    rl.question('Enter item number to buy', (index) =>{
        listOfGroceries[index - 1].bought = true;
        viewGroceryList();
        displayMenu();
    })
}
let handleMenuChoice = function(choice){
    switch(choice) {
        case '1':
            viewGroceryList();
            displayMenu();
            break;
        case '2':
            addItem();
            break;
        case '3': 
            removeItem();
            break;
        case '4':
            markItemAsBought();
            break;
        case '5':
            rl.close();
            break;
        default:
            console.log("Invalid choice, please try again");
            displayMenu();
            break;
    }
}



rl.once('close', () => {
     // end of input
     console.log("Goodbye");
 });

displayMenu();