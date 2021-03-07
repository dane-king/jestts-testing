import { applyMiddleware, bindActionCreators } from './index';
import { combineReducers, createStore } from ".";

type Reducer = (state: any, action: any) => void;
type Listener = any;
type Action = any;
type Store = {
    getState: () => { value: number, word: string };
    dispatch: (action: Action) => void;
    subscribe: any;
};

const TestActions: = {
    "ADD_NUM": (num:number) => {
        return { type: "ADD", num: num }
    },
    "ADD_SUFFIX": (end:string) => {
        return { type: "SUFFIX", suffix: end }
    }
}



describe("Create Store ", () => {

    let store: Store;

    let reducer: Reducer;

    let blankAction: Action = {};

    beforeEach(() => {
        reducer = jest.fn((state, action) => { })
        store = createStore(reducer)
    });

    test("state is created with a reducer and state undefined", () => {
        expect(store.getState()).toBeUndefined()
    });
    test('should call reducer on dispatch', () => {
        store.dispatch(blankAction)
        expect(reducer).toHaveBeenCalled()
    });


    test('should notify listeners when dispatch is called', () => {
        const notify1: Listener = jest.fn();
        const notify2: Listener = jest.fn();
        const notify3: Listener = jest.fn();

        store.subscribe(notify1);
        store.subscribe(notify2);
        const unsubscribe = store.subscribe(notify3);

        unsubscribe();

        store.dispatch(blankAction);

        expect(notify1).toHaveBeenCalled();
        expect(notify2).toHaveBeenCalled();
        expect(notify3).not.toHaveBeenCalled();
    });
    describe('Reducer', () => {
        let numberReducer: Reducer;
        let textReducer: Reducer;
        beforeEach(() => {
            numberReducer = (state = { value: 0 }, action) => {
                switch (action.type) {
                    case "ADD":

                        return {
                            ...state,
                            value: state.value + action.num
                        }
                    case "SUBTRACT":
                        return {
                            ...state,
                            value: state.value - action.num
                        }

                    default:
                        return state;
                }
            }

            textReducer = (state = { word: 'test' }, action) => {
                switch (action.type) {
                    case "SUFFIX":
                        return {
                            ...state,
                            word: state.word + action.suffix
                        }

                    default:
                        return state
                }

            }
        });
        test('should update state', () => {
            function reducer() {
                return { value: 5 };
            }
            const store = createStore(reducer);
            store.dispatch({});
            const state = store.getState()
            expect(state).toEqual({ value: 5 });

        });
        test('should create new state', () => {
            const store = createStore(numberReducer
            );
            store.dispatch(TestActions.ADD_NUM(1));
            store.dispatch(TestActions.ADD_NUM(1));
            const state = store.getState()
            expect(state).toEqual({ value: 2 });

        });
        test('should be able to combine reducers and use bind actions', () => {
            const combinedReducers: Reducer = combineReducers(numberReducer, textReducer);
            const store = createStore(combinedReducers);
            const bindActions = bindActionCreators(TestActions, store.dispatch);
            bindActions.ADD_NUM(1);
            expect(store.getState()).toEqual({ "0": { "value": 1 }, "1": { "word": "test" } });
            bindActions.ADD_SUFFIX('ing');
            expect(store.getState()).toEqual({ "0": { "value": 1 }, "1": { "word": "testing" } });
            bindActions.ADD_NUM(3);
            expect(store.getState()).toEqual({ "0": { "value": 4 }, "1": { "word": "testing" } });
        });

        test('should call middleware', () => {
            const mockMiddleware = jest.fn(store => next => action => {
                return next(action)
            });
            const enhancedStore = applyMiddleware(mockMiddleware)(createStore)(numberReducer)
            enhancedStore.dispatch(TestActions.ADD_NUM(1));
            expect(mockMiddleware).toHaveBeenCalled();
            expect(enhancedStore.getState()).toEqual({ value: 1 });


        });

    });
});