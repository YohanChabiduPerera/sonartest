import { configureStore } from '@reduxjs/toolkit';
import caseReducer from './caseSlice';
import loaderReducer from './loaderSlice';

const store = configureStore({
  reducer: {
    case: caseReducer,
    loader: loaderReducer,
  },
});

export default store;