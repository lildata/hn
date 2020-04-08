import React, { useState, useEffect/*, Suspense*/ } from 'react';
import axios from 'axios';
import moment from 'moment';
//import Identicon from 'react-identicons';

function App() {
  const [posts, setPosts] = useState([]);
  const [length, setLength] = useState(10);

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

  /*
  useEffect(() => {
    console.log(posts);
  }, [length]);
  */

  return (
    <div className="App">
      <Header />
      <div className="list-group list-group-flush">
          { posts.sort((a, b) => (a.score < b.score) ? 1 : -1)
                .map((x) => <Post key={x.id} post={x} />) }
        <button onClick={() => {setLength(length + 10); setPosts([]);}} className="list-group-item list-group-item-action">Load more</button>
      </div>
    </div>
  );
}

function Post({ post }) {
  return (
    <div id="Post">
      <a href={post.url} target="_blank" rel="noopener noreferrer" className="list-group-item list-group-item-action">
        {/*<Identicon size="30" string={post.url} />*/}
        <div className="d-flex w-100 justify-content-between">
          <span className="mb-1">{post.title}</span>
          <span><a className="badge badge-primary badge-pill" href={"https://news.ycombinator.com/item?id=" + post.id}>{post.descendants}</a></span>
        </div>
        <div className="d-flex w-100 justify-content-between">
          <small style={{color: 'grey'}}>{post.url && (new URL(post.url)).hostname}</small>
          <small>{moment.unix(post.time).fromNow()}</small>
        </div>
      </a>
    </div>
  );
}

const Header = () =>
  <nav className="navbar navbar-dark bg-primary">
    <a className="navbar-brand" href="/">HN</a>
    {/*<div className="navbar-nav  mr-auto">
      <a className="nav-item nav-link" href="#">Top</a>
      <a className="nav-item nav-link" href="#">New</a>
    </div>*/}

    <form action="https://hn.algolia.com/" method="get" className="form-inline">
      <input className="form-control mr-sm-2" type="search" id="q" name="q" placeholder="Search" aria-label="Search" />
      {/*<button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>*/}
    </form>

  </nav>
  ;

export default App;
