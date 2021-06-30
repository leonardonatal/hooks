import React, { useReducer, useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient]
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
      default:
        throw new Error('Should not get there!');    
  }
};



function Ingredients() {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const { isLoading, data, error, sendRequest, reqExtra, reqIdentifier } = useHttp();
  
  // const [ userIngredients, setUserIngredients ]  = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState()

  useEffect(() => {
    if( !isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({type: 'DELETE', id: reqExtra });
    } else if (!isLoading &&  !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({type: 'ADD', ingredient: { id: data.name, ...reqExtra }})
    }
    
  }, [data, reqExtra, reqIdentifier, isLoading, error]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({type: 'SET', ingredients: filteredIngredients})
  }, []);

  // it caches the function to prevent infinite loop and executs onyl when called



  const addIngredientHandler = useCallback(ingredient => {
    sendRequest(
      'https://react-hooks-923f1-default-rtdb.firebaseio.com/ingredients.json',
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
    )
  }, [sendRequest]);

  const removeIngredientHandler = useCallback(ingredientId => {
    sendRequest(
      `https://react-hooks-923f1-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      'DELETE', 
      null,
      ingredientId,
      'REMOVE_INGREDIENT'
      )
    
  }, [sendRequest]);

  const clearError = () => {
    // dispatchHttp({type: 'CLEAR'});
  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
