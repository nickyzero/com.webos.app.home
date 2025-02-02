import { InputField } from '@enact/sandstone/Input';
import css from './SearchBar.module.less';
import AppSorting from '../AppSorting/AppSorting';
import { useCallback, useEffect, useState } from 'react';
import { addSearchName } from '../../actions/registerKind';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '@enact/sandstone/Icon';
import { SEARCH_STRING } from '../../actions/actionNames';

const SearchBar = ({ onFilter }) => {
    const [placeholderText, setPlaceholderText] = useState('Search');
    const [showClearIcon, SetShowClearIcon] = useState(false);
    const [inputValue, setInputValue] = useState('')
    const searchString = useSelector(state=>state.searchString);
    const dispatch = useDispatch();
    useEffect(()=>{
        if(searchString){
            setInputValue(searchString);
            onFilter(searchString);
            SetShowClearIcon(true);
            dispatch({
                type:SEARCH_STRING,
                payload:''
            });
        }
    },[searchString,dispatch,onFilter])
    const onFocusHandler = useCallback(() => {
        setPlaceholderText('');
    }, []);

    const onBlurHandler = useCallback(() => {
        setPlaceholderText('Search');
    }, [])

    const onChangeHandler = useCallback((event) => {
        SetShowClearIcon(false);
        setInputValue(event.value);
    }, [])

    const onKeyPressHandler = useCallback((event) => {
        if (event.key === "Enter") {
            onFilter(inputValue);
            SetShowClearIcon(true);
            if(inputValue.length > 0){
                dispatch(addSearchName(inputValue));
            }
        }
    }, [inputValue, onFilter, dispatch])

    const onClearHandler = useCallback(() => {
        setInputValue('');
        onFilter('');
        SetShowClearIcon(false);
    }, [onFilter]);

    return (
        <>
            <InputField className={css.input_cnt}
                value={inputValue}
                onKeyPress={onKeyPressHandler}
                onChange={onChangeHandler}
                css={css}
                onBlur={onBlurHandler}
                onFocus={onFocusHandler}
                dismissOnEnter
                placeholder={placeholderText} />
            {/* <input type='text'   className={css.input_cnt} css ={css} placeholder='Search'/>  */}

            <div className={css.appsorting}>
                {showClearIcon ? <Icon onClick={onClearHandler}>closex</Icon> : <AppSorting />}
            </div>


            </>
    )
}
export default SearchBar;