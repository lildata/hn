import React, { useState, useEffect/*, Suspense*/ } from 'react';
import axios from 'axios';
import moment from 'moment';

function App() {
  const [posts, setPosts] = useState([]);
  const [length, setLength] = useState(1);

  useEffect(() => {
    async function fetchData() {
      
      const topStories = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
      topStories.data.slice(0, length).map(async (x) => {
        const res = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${x}.json`);
        setPosts((p) => [...p, res.data]);
      });
    }

    fetchData();
  }, [length]);


  return (
    <div className="App">
      <Header />
      <div class="list-group">
        {/*<Suspense fallback={<h1>loading ...</h1>}>*/} {/* does not work */}
          { posts.map((x) => <Post key={x.id} post={x} />) }
        {/*</Suspense>*/}
        <button onClick={() => {setLength(length + 1); setPosts([]);}} class="list-group-item list-group-item-action">Load more</button>
      </div>
    </div>
  );
}

function Post({ post }) {
  return (
    <div id="Post">
      <a href={post.url} target="_blank" rel="noopener noreferrer" class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
          <span class="mb-1">{post.title}</span>
          <span><a class="badge badge-primary badge-pill" href={"https://news.ycombinator.com/item?id=" + post.id}>{post.descendants}</a></span>
        </div>
        <div class="d-flex w-100 justify-content-between">
          <small style={{color: 'grey'}}>{post.url && (new URL(post.url)).hostname}</small>
          <small>{moment.unix(post.time).fromNow()}</small>
        </div>
      </a>
    </div>
  );
}

const Header = () =>
  <nav class="navbar navbar-dark bg-primary">
    <a class="navbar-brand" href="#">HN</a>
    {/*<div class="navbar-nav  mr-auto">
      <a class="nav-item nav-link" href="#">Top</a>
      <a class="nav-item nav-link" href="#">New</a>
    </div>*/}

    <form action="https://hn.algolia.com/" method="get" class="form-inline">
      <input class="form-control mr-sm-2" type="search" id="q" name="q" placeholder="Search" aria-label="Search" />
      {/*<button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>*/}
    </form>

  </nav>
  ;

export default App;
