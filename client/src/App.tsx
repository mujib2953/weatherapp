import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

interface Position {
	lon: number;
	lat: number;
};

interface Weather {
	main: string;
	desc: string;
	icon: string;
}

interface Temperature {
	actual: number;
	min: number;
	max: number;
	humid: number;
	visibility: number;
	pressure: number;
}

interface Wind {
	deg: number;
	speed: number;
}

interface Extra {
	sunrise: number;
	sunset: number;
	timezone: number;
}

interface CityData {
	name: string;
	country: string;
	coord: Position;
	weather: Weather;
	temp: Temperature;
	wind: Wind;
	extra: Extra;
};

const useStyles = makeStyles(theme => ({
	myContainer: {
		display: "flex",
		justifyContent: "center",
		flexDirection: "column"
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 250,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
	weatherBlock: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	temperatureText: {
		fontSize: "30px",
		fontWeight: "bold",
	},
	spaceBewteenFlex: {
		display: "flex",
		justifyContent: "space-between",
		borderBottom: "1px solid rgba(0, 0, 0, 0.54)",
		paddingBottom: "10px",
		marginBottom: "10px"
	}
}));


function App() {

	const classes = useStyles();
	const [city, setCity] = React.useState<string>('new york');
	const [cityData, setCityData] = React.useState<CityData | undefined>(undefined);

	const handleChange = (event: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
		const newCity = event.target.value as string;
		setCity(newCity);
		getData(newCity);
	};

	React.useEffect(() => {
		getData(city);
	}, []);

	const getData = async (city_name: string) => {
		try {
			const resp = await fetch(`/api/weather?city=${city_name}`);
			const data = await resp.json();

			setCityData({
				name: data.name,
				country: data.sys.country,
				coord: data.coord,
				weather: {
					main: data.weather[0].main,
					desc: data.weather[0].description,
					icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
				},
				temp: {
					actual: data.main.temp,
					min: data.main.temp_min,
					max: data.main.temp_max,
					humid: data.main.humidity,
					visibility: data.visibility,
					pressure: data.main.pressure,
				},
				wind: data.wind,
				extra: {
					sunrise: data.sys.sunrise,
					sunset: data.sys.sunset,
					timezone: data.timezone,
				},
			});
		} catch(e) {
			console.log(e);
			setCityData(undefined);
		}
	};

	return (
		<React.Fragment>
			<CssBaseline />
			<Typography align="center" variant="h2">Weather App</Typography>
			<Container maxWidth="sm" className={classes.myContainer}>
				
				<FormControl className={classes.formControl}>
					<InputLabel id="demo-simple-select-label">Select City</InputLabel>
					<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={city}
						onChange={handleChange}
					>
						<MenuItem value={"new york"}>New York</MenuItem>
						<MenuItem value={"boston"}>Boston</MenuItem>
						<MenuItem value={"california"}>California</MenuItem>
						<MenuItem value={"san fransisco"}>San Faransisco</MenuItem>
					</Select>
				</FormControl>

				{
					cityData !== undefined ? (
						<Card>
							<CardContent>

								<Container>
									<Typography align="center" color="textSecondary" gutterBottom>
										{cityData.name} | {cityData.country}
									</Typography>
									<Typography align="center" color="textSecondary" gutterBottom>
										Geo coords : 
										{
											<a
												target="_blank"
												href={`https://www.google.com/maps/search/?api=1&query=${cityData.coord.lat},${cityData.coord.lon}`}
												rel="noopener noreferrer"
											>
												[ {cityData.coord.lon}, {cityData.coord.lat} ]
											</a>
										}
										
									</Typography>
								</Container>
								
								<Container className={classes.weatherBlock}>
									<Typography>
										Weather: { cityData.weather.main } | { cityData.weather.desc }
									</Typography>
									
									<Typography>
										<img src={ cityData.weather.icon } alt={ cityData.name } />
									</Typography>

									<Typography className={ classes.temperatureText }>
										{ cityData.temp.actual } °C
									</Typography>
								</Container>

								<Container className={ classes.spaceBewteenFlex }>
									
									<Typography>
									Wind: {cityData.wind.speed} m/s { cityData.wind.deg ? `(${cityData.wind.deg})` : "" }
									</Typography>
									
								</Container>
								
								<Container className={ classes.spaceBewteenFlex }>
									<Typography>
										Temperature: 
									</Typography>
									
									<Typography>Min: { cityData.temp.min } °C</Typography>
									<Typography>Max: { cityData.temp.max } °C</Typography>
								</Container>

								<Container className={ classes.spaceBewteenFlex }>
									<Typography>Pressure: { cityData.temp.pressure } hpa</Typography>

									<Typography>Humidity: { cityData.temp.humid } %</Typography>
								</Container>

							</CardContent>
						</Card>
					) : undefined
				}
			</Container>
		</React.Fragment>
	);
}



export default App;
