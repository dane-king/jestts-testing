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