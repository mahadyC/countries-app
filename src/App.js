import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";
import React from "react";
import axios from "axios";

class App extends React.Component {
  state = {
    search: "",
    countries: [],
  };

  componentDidMount() {
    axios
      .get(
        "https://restcountries.com/v2/all?fields=name,capital,flags,languages,currencies,population"
      )
      .then((res) => {
        const countries = res.data;
        console.log(countries);
        this.setState({ countries });
      });
  }

  changeHandler = (event) => {
    this.setState({
      search: event.target.value,
    });
  };

  render() {
    return (
      <Router>
        <div>
          <main>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route
                path="/countries"
                element={
                  <CountryList
                    countries={this.state.countries}
                    search={this.state.search}
                    changeHandler={this.changeHandler}
                  />
                }
              />
              <Route
                path="/countries/:capitalName"
                element={<RouteWrapper />}
              />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
        </div>
      </Router>
    );
  }
}

const Home = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/countries">Countries</Link>
          </li>
        </ul>
      </nav>
      <h1>Welcome Home</h1>
    </div>
  );
};

const About = () => {
  return (
    <div>
            <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/countries">Countries</Link>
          </li>
        </ul>
      </nav>
      <h1>About this application</h1>
    </div>
  );
};

class CountryList extends React.Component {
  render() {
    return (
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/countries">Countries</Link>
            </li>
          </ul>
          <div className="searchInput">
            <label htmlFor="search">
              <input
                type="text"
                name="search"
                onChange={this.props.changeHandler}
              ></input>
            </label>
          </div>
        </nav>
        <div className="card-list">
          {this.props.search === ""
            ? this.props.countries.map((country) => (
                <CountryCard
                  key={country.name}
                  name={country.name}
                  capital={country.capital}
                />
              ))
            : this.props.countries
                .filter((country) =>
                  country.name
                    .toLowerCase()
                    .includes(this.props.search.toLowerCase())
                )
                .map((item) => (
                  <CountryCard
                    name={item.name}
                    key={item.name}
                    capital={item.capital}
                  />
                ))}
        </div>
      </div>
    );
  }
}

const CountryCard = (props) => {
  return (
    <div className="card">
      <h2>{props.name}</h2>
      <img
        src={`https://source.unsplash.com/1600x900/?${props.name}`}
        alt="country"
      />
      <Link to={`/countries/${props.capital}`}>Read more</Link>
    </div>
  );
};

const RouteWrapper = () => {
  let { capitalName } = useParams();
  let navigate = useNavigate();
  const handleClick = () => {
    navigate("/countries");
  };
  return (
    <SingleCountry
      capitalName={capitalName}
      handleClick={handleClick}
    ></SingleCountry>
  );
};

const getCountry = (capital) => {
  return axios.get(`https://restcountries.com/v2/capital/${capital}`);
};

const getWeather = (capital) => {
  console.log(process);
  return axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${process.env.REACT_APP_OPENWEATHER_KEY}`
  );
};

class SingleCountry extends React.Component {
  state = {
    country: {},
    weather: {},
    loaded: false,
  };

  componentDidMount() {
    Promise.all([
      getCountry(this.props.capitalName),
      getWeather(this.props.capitalName),
    ]).then((res) => {
      this.setState({
        country: res[0].data[0],
        weather: res[1].data,
        loaded: true,
      });
    });
  }

  render() {
    if (this.state.loaded) {
      return (
        <div className="weatherCardContainer">
          <div className="weatherCard">
            <div className="city">
              <h3>Capital:</h3>
              <span>{this.state.country.capital}</span>
            </div>
            <div className="temp">
              <h3>Current temp:</h3>
              <span>{this.state.weather.main.temp} °C </span>
            </div>
            <div className="imageHolder">
              <img
                src={`http://openweathermap.org/img/wn/${this.state.weather.weather[0].icon}@2x.png`}
                alt={this.state.weather.weather[0].description}
                style={{ width: 80, height: 80, display: "inline-block" }}
              />
            </div>
          </div>
          <button onClick={this.props.handleClick}>Go Back</button>
        </div>
      );
    }
    if (!this.state.loaded) {
      return (
        <div>
          <p>Single {`${this.props.capitalName}`} description here</p>
          <button onClick={this.props.handleClick}>Go Back</button>
        </div>
      );
    }
  }
}

export default App;
