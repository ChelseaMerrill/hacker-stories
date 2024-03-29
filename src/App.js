import React from 'react';
import axios from 'axios';

const initialStories= [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

const getAsyncStories = () =>
new Promise(resolve =>
  setTimeout(
    () => resolve({data: {stories: initialStories}}),
    2000
  )
);

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
}

const API_ENDPOINT = `https://hn.algolia.com/api/v1/search?query=`;

const App = () => {
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    {data: [], isLoading: false, isError:false}
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);


  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({type: 'STORIES_FETCH_INIT'});

    try {
    const result = await axios.get(url);

    dispatchStories({
      type: 'SRORIES_FETCH_SUCCESS',
      payload: result.data.hits,
    });
    } catch {
      dispatchStories({type: 'STORIES_FETCH_FAILURE'});
      }
    }, [url]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
    const newStories = stories.filter(
      story => item.objectID !== story.objectID
    );
    dispatchStories({
      type: 'SET_STORIES',
      payload: newStories,
    });
  };

  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
  );

  const [url, setUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  );

  React.useEffect(() => {
    localStorage.setItem('search', searchTerm);
  }, [searchTerm]);

  const handleSearchInput = event => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = event => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);

    event.preventDefault();
  };

  const searchedStories = stories.data.filter(story => 
    story.title.toLocaleLowerCase().includes(searchTerm.toLowerCase())
  )

  const SearchForm = ({
    searchTerm,
    onSearchInput,
    onSearchSubmit,
  }) => (
    <form onSubmit={onSearchSubmit}>
 <InputWithLabel 
  id='search'
  vaue={searchTerm}
  isFocused
  onInputChange={onSearchInput}
  >

   <strong>Search:</strong>
  </InputWithLabel>

  <button type='submit' disabled={!searchTerm}>
   Submit
  </button>
 </form>
  );


  return (
    <div>
     <h1>My Hacker Stories</h1>

     <SearchForm
     searchTerm={searchTerm}
     onSearchInput={handleSearchInput}
     onSearchSubmit={handleSearchSubmit}
     />

     <hr />
     {stories.isError && <p>Something Went Wrong...</p>}
     {stories.isLoading ? (
       <p>Loading...</p>
     ) : (
      <List list={stories.data} onRemoveItem={handleRemoveStory} />
     )}
     </div>
  );
};

const InputWithLabel = ({
  id, 
  label, 
  value, 
  type = 'text',
  onInputChange,
  isFocused,
  children,
}) => {
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused && inputRef.crrent) {
      inputRef.current.focus();
    }
  }, [isFocused]);
  return (
<>
  <label htmlFor={id}>{children}</label>
  &nbsp;
  {}
  <input
  ref={inputRef}
  id={id}
  type={type}
  value={value}
  autoFocus={isFocused}
  onChange={onInputChange}
  />
  </>
  )
};


const Search = ({ search, onSearch }) => (
  <>
  <label htmlFor='search'>
    Search: 
    </label>,
  <input
   id='search' 
   type='text' 
   value={search}
   onChange={onSearch}/>
  </>
);

const storiesReducer = (state, action) => {
  switch (action.type){
    case 'SET_fETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
      case 'STORIES_FETCH_SUCCESS':
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
        };
        case "STORIES_FETCH_FAILURE":
          return{
            ...state,
            isLoading: false,
            isError: true,
          };
       case'REMOVE_STORY':
        return{
          ...state,
          data: state.data.filter(
            story => action.payload.objectID !== story.objectID
          ),
        }; 
        default:
          throw new Error();
     }
};
    
const List = ({ list, onRemoveItem }) =>
  list.map(item => (
  <Item 
  key={item.objectID} 
  item={item}
  onRemoveItem={onRemoveItem}
  />
  ));
  
  const Item = ({item, onRemoveItem}) => {
    function handleRemoveItem() {
      onRemoveItem(item);
    }

    return (
      <div>
         <span>
           <a href={item.url}>{item.title}</a>
         </span>
         <span>{item.author}, </span>
         <span>{item.num_comments}, </span>
         <span>{item.points}, </span>
         <span>
           <button type="button" onClick={() => onRemoveItem(item)}>
             Dismiss
           </button>
         </span>
       </div>
    )    
  };
      
    

export default App;
