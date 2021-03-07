export const createStore = reducer =>{
    let state:any;
    let listeners=[];

    const getState=()=>state
    
    const dispatch=action=>{
        state=reducer(state,action);
        listeners.forEach(l=>l())
    };
    
    const subscribe = listener => {
        listeners.push(listener)
        return function unsubscribe(){
            const pos=listeners.indexOf(listener);
            listeners=listeners.filter(l=>l!=listener)
        }
    };

    return {getState,dispatch, subscribe};
}

export const combineReducers= (...reducers) =>{
    const reducerKeys=Object.keys(reducers);
    return function combinedReducer(state={}, action){
        let nextState={};
        reducerKeys.forEach(key=>{
            nextState[key]=reducers[key](state[key],action)
        })
        return nextState;
    }
}

export const applyMiddleware = middleware =>{
    return createStore => reducer => {
        const store = createStore(reducer)
        return {
            ...store,
            dispatch: function (action) {
                return middleware(store)(store.dispatch)(action);
            }
        }
    }
}

/**
 * Wraps Action Creators in `dispatch` calls for the consumer so
 * that they don't have to call `store.dispatch(ActionCreator.something())`
 * each time.
 */
 export const bindActionCreators = (actionCreators, dispatch) => {
    const boundedActionCreators = {}
    const actionKeys = Object.keys(actionCreators)
    actionKeys.forEach(key => {
      const actionCreator = actionCreators[key]
      boundedActionCreators[key] = function boundedActionCreator() {
        return dispatch(actionCreator.apply(this, arguments))
      }
    })

    return boundedActionCreators
  }