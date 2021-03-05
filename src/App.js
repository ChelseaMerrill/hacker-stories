import React from 'react';

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

const App = () => {
  const [stories, setStories] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);

    getAsyncStories().then(result => {
      setStories(result.data.stories);
      setIsLoading(false);
    })
    .catch(() => setIsError(true));
  }, []);

  const handleRemoveStory = item => {
    const newStories = stories.filter(
      story => item.objectID !== story.objectID
    );
    setStories(newStories);
  };

  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
  );

  React.useEffect(() => {
    localStorage.setItem('search', searchTerm);
  }, [searchTerm]);

  const handleSearch = event => {
    setSearchTerm(event.target.value);

    localStorage.setItem('search', event.target.value)
  };

  const searchedStories = stories.filter(story => 
    story.title.toLocaleLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
     <h1>My Hacker Stories</h1>

     <InputWithLabel 
     id='search'
     vaue={searchTerm}
     isFocused
     onInputChange={handleSearch}>

      <strong>Search:</strong>
     </InputWithLabel>

     <hr />
     {isError && <p>Something Went Wrong...</p>}
     {isLoading ? (
       <p>Loading...</p>
     ) : (
      <List list={searchedStories} onRemoveItem={handleRemoveStory} />
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

//hook
//useState takes in default and search term and setSearchTerm changes itself to what the searchTerm is
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
