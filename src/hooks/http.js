import { useReducer, useCallback } from "react";

const httpReducer = (curHttpState, action) => {
    switch (action.type) {
      case 'SEND':
        return { loading: true, error: null, data: null, extra: null, identifier: action.identifier};
      case 'RESPONSE':
        return { ...curHttpState, loading: false, data: action.responseData, extra: action.extra };
      case 'ERROR':
        return { loading: false, error: action.errorMessage };
      case 'CLEAR':
        return { ...curHttpState, error: null };
        default:
          throw new Error('should not be reached');    
    }
};

const useHttp = () => {
    const [httpState , dispatchHttp] = useReducer(httpReducer, { loading: false, error: null, data: null, extra: null, identifier: null});

    const sendRequest = useCallback((url, method, body, reqExtra, reqidentifier) => {
        dispatchHttp({type: 'SEND', identifier: reqidentifier});
        fetch(url, {
            method: method,
            body: body,
            headers: {
                'content-type': 'application/json'
            }
          }).then(response => {
            return response.json();
          })
          .then(responseData => {
              dispatchHttp({ type: 'RESPONSE', responseData: responseData, extra: reqExtra});
          })
          .catch(error => {
            dispatchHttp({type: 'ERROR', errorMessage: error.message});
          });
    }, []);

   
    return {
        isLoading: httpState.loading,
        data: httpState.data,
        error: httpState.error,
        sendRequest: sendRequest,
        extra: null,
        reqExtra: httpState.extra,
        reqIdentifier: httpState.identifier
    };
};

export default useHttp;