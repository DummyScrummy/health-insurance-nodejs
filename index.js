const express = require('express'); // Import Express
const cors = require('cors'); // Import CORS
const path = require('path'); // Import file paths

// Create an Express application
const app = express();
const port = process.env.PORT || 3000; // Set the port

// Allow requests from all origins
app.use(cors());

// Use static files from the static folder
app.use(express.static(path.join(__dirname, 'static')));

// Age risk calculation
app.get('/age-risk', (req, res) => {
    const ageOption = req.query.ageOption; // Extract the age option chosen from the passed in parameter
    var ageRisk = 0; // Initialize ageRisk to 0
    
    // Assign the risk point values for each age threshold
    if (ageOption === '1') {
        ageRisk = 0;
    } else if (ageOption === '2') {
        ageRisk = 10;
    } else if (ageOption === '3') {
        ageRisk = 20;
    } else {
        ageRisk = 30;
    }

    // Send JSON response with age risk result
    res.json({
        ageRisk: ageRisk
    });
});

// BMI risk
app.get('/bmi-risk', (req, res) => {
    const heightFeet = req.query.heightFeet; // Extract heightFeet value from passed in paramter
    const heightInches = req.query.heightInches; // Extract heightInches value from passed in paramter
    const weightPounds = req.query.weight; // Extract weight value from passed in paramter
	var bmiRisk = 0; // Initialize bmiRisk to 0

    // Calculate BMI
    const heightImperial = parseInt(heightFeet * 12) + parseInt(heightInches); // Converts total height to inches (Imperial)
    const heightMetric = (heightImperial * 0.0254) * (heightImperial * 0.0254); // Converts inches into meters squared (Metric)
	let weightMetric = weightPounds * 0.453592; //Converts weight (pounds) to kilos
    const bmi = Math.round((weightMetric / heightMetric) * 10) / 10; // Calculates BMI and rounds to one decimal place

    // Determine risk score for BMI based on categories
    if (bmi >= 18.5 && bmi <= 24.9) { // Normal weight
        bmiRisk = 0;
    } else if (bmi >= 25.0 && bmi <= 29.9) { // Overweight
        bmiRisk = 30;
    } else { // Obese
        bmiRisk = 75;
    }

    // Send JSON response with bmiRisk
    res.json({
        bmiRisk: bmiRisk
    });
});

// Pressure risk
app.get('/pressure-risk', (req, res) => {
    const pressureOption = req.query.pressureOption; // Extract the pressure option chosen from the passed in parameter
    var pressureRisk = 0; // Initialize pressureRisk to 0
    
    // Assign the risk point values for each pressure option threshold
    if (pressureOption === '0') {
        pressureRisk = 0;
    } else if (pressureOption === '1') {
        pressureRisk = 15;
    } else if (pressureOption === '2') {
        pressureRisk = 30;
	} else if (pressureOption === '3') {
        pressureRisk = 75;
    } else {
        pressureRisk = 100;
    }

    // Send JSON response with age risk result
    res.json({
        pressureRisk: pressureRisk
    });
});

// Family history risk
app.get('/history-risk', (req, res) => {
    const diabetesChecked = req.query.diabetesChecked; // Value that says if diabetes is checked
    const cancerChecked = req.query.cancerChecked; // Value that says if cancer is checked
    const alzheimersChecked = req.query.alzheimersChecked; // Value that says if Alzheimer's is checked
    var historyRisk = 0; // Initialize historyRisk to 0

	// Calculate the points based on the checked checkboxes
	if (diabetesChecked === 'true') {
		historyRisk += 10; // Add 10 points for diabetes
	}
	if (cancerChecked === 'true') {
		historyRisk += 10; // Add 10 points for cancer
	}
	if (alzheimersChecked === 'true') {
		historyRisk += 10; // Add 10 points for Alzheimer's
	}

    // Send JSON response with history risk points
    res.json({
        historyRisk: historyRisk
    });
});

// Custom 404 page
app.use((req, res) => {
    res.type('text/plain')
    res.status(404)
    res.send('404 - Not Found')
})

// Custom 500 page
app.use((err, req, res, next) => {
    console.error(err.message)
    res.type('text/plain')
    res.status(500)
    res.send('500 - Server Error')
})

// Start the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});