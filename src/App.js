import React,{useState, useEffect} from 'react';
import './App.css';

import ExpenseList from './components/ExpenseList'
import ExpenseForm from './components/ExpenseForm'
import Alert from './components/Alert'
import uuid from 'uuid';

// const initialExpenses = [
//   {
//     id: uuid(),
//     charge: "rent",
//     amount: 1600
//   },
//   {
//     id: uuid(),
//     charge: "car payment",
//     amount: 400
//   },
//   {
//     id: uuid(),
//     charge: "credit card bill", 
//     amount: 1200
//   }
// ]
const initialExpenses = localStorage.getItem('expenses')? JSON.parse(localStorage.getItem("expenses")) : []
// console.log(initialExpenses);

function App() {
  //********* state values */
  //all expenses, add expense

  const [expenses, setExpenses] = useState(initialExpenses)

  //single expense
  const [charge, setCharge] = useState('');

  const [amount, setAmount] = useState('');

  const [alert, setAlert] = useState({show:false})

  //edit item
  const [edit, setEdit] = useState(false);

  const [id, setId] = useState(0);

  //use effect
  useEffect(()=> {
    console.log('we called effect')
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  const handleCharge = e => {
    console.log(`charge: ${e.target.value}`);
    setCharge(e.target.value)
  }
  const handleAmount = e => {
    console.log(`charge: ${e.target.value}`);
    setAmount(e.target.value)
  }
  const handleAlert = ({type, text}) => {
    setAlert({show:true, type, text})
    setTimeout(()=>{
      setAlert({show:false})
    }, 3000)
  }
  const handleSubmit = e => {
    e.preventDefault();
    // alert('hello world');
    if(charge !== '' && amount > 0) {

      if (edit) {
        let tempExpenses = expenses.map(item => {
          return item.id === id?{...item, charge, amount} :item
        })
        setExpenses(tempExpenses)
        setEdit(false)
        handleAlert({type: "success", text: "Item has been edited"})
      }else {
        const singleExpense = {id:uuid(), charge, amount}
        setExpenses([...expenses, singleExpense])
        handleAlert({type:'success', text:"item added"})
      }

      setCharge('')
      setAmount('')

    }else {
      // handle alert called
      handleAlert({type:'danger', text:`charge can't be empty value and amount value has to be bigger than zero`})
    }
  }
  const clearItems = () => {
    setExpenses([]);
  }
  //handle delete item
  const handleDelete = (id) => {
    let tempExpenses = expenses.filter(item => item.id !== id)
    setExpenses(tempExpenses)
    handleAlert({type:'danger', text:`item hadsbeen deleted`})
  }
  const handleEdit = (id) => {
    let expense = expenses.find(item => item.id === id)
    let {charge, amount} = expense
    setCharge(charge)
    setAmount(amount)
    setEdit(true)
    setId(id)
  }
  //********* Functionality */
  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text} />}
      <Alert />
      <h1>Budget Calculator</h1>
      <main className="App">
        <ExpenseForm 
          charge={charge} 
          amount={amount} 
          handleAmount={handleAmount} 
          handleCharge={handleCharge} 
          handleSubmit={handleSubmit}
          edit={edit}
        />
        <ExpenseList expenses={expenses} 
                     handleDelete={handleDelete}
                     handleEdit={handleEdit}
                     clearItems={clearItems}
        />
      </main>
  <h1>Total Spending:{" "} 
  <span className="total">$ {" "}{expenses.reduce((acc, curr)=>{
    return (acc +=  parseInt(curr.amount))
  },0)}</span></h1>
  
    </>
  );
}

export default App;
