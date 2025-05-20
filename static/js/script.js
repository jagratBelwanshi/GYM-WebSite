document.addEventListener('DOMContentLoaded', function() {
    // Calendar functionality
    const calendar = document.getElementById('calendar');
    const currentMonthYear = document.getElementById('current-month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    
    // Workout days tracking
    let workoutDays = JSON.parse(localStorage.getItem('workoutDays')) || [];
    
    function generateCalendar() {
        calendar.innerHTML = '';
        
        // Set month and year header
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
        currentMonthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        // Get first day of month and total days
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        // Add day headers
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.textContent = day;
            dayElement.classList.add('day-header');
            calendar.appendChild(dayElement);
        });
        
        // Add empty cells for days before the first day of month
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('day', 'empty');
            calendar.appendChild(emptyCell);
        }
        
        // Add days of month
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today's date for comparison
        
        for (let i = 1; i <= daysInMonth; i++) {
            const dayElement = document.createElement('div');
            dayElement.textContent = i;
            dayElement.classList.add('day');
            
            const dateStr = `${currentYear}-${currentMonth + 1}-${i}`;
            const thisDate = new Date(currentYear, currentMonth, i);
            thisDate.setHours(0, 0, 0, 0); // Normalize date for comparison
            
            // Today's date
            if (thisDate.getTime() === today.getTime()) {
                dayElement.classList.add('today');
                if (workoutDays.includes(dateStr)) {
                    dayElement.classList.add('workout-day');
                    dayElement.style.backgroundColor = '#4CAF50'; // Green if workout day
                } else {
                    dayElement.style.backgroundColor = '#2196F3'; // Blue if not workout day
                }
                dayElement.style.color = 'white';
                
                // Add click event for today's date
                dayElement.addEventListener('click', function() {
                    // Toggle workout status
                    if (workoutDays.includes(dateStr)) {
                        // Remove from workout days
                        workoutDays = workoutDays.filter(day => day !== dateStr);
                        dayElement.classList.remove('workout-day');
                        dayElement.style.backgroundColor = '#2196F3'; // Back to blue
                    } else {
                        // Add to workout days
                        workoutDays.push(dateStr);
                        dayElement.classList.add('workout-day');
                        dayElement.style.backgroundColor = '#4CAF50'; // Change to green
                    }
                    localStorage.setItem('workoutDays', JSON.stringify(workoutDays));
                    
                    // Show workout schedule
                    showWorkoutSchedule(thisDate);
                });
            } 
            // Past dates
            else if (thisDate < today) {
                if (workoutDays.includes(dateStr)) {
                    dayElement.classList.add('workout-day');
                    dayElement.style.backgroundColor = '#4CAF50';
                    dayElement.style.color = 'white';
                } else {
                    dayElement.classList.add('missed-day');
                    dayElement.style.backgroundColor = '#f44336';
                    dayElement.style.color = 'white';
                }
                // Make past dates unclickable
                dayElement.style.cursor = 'default';
                dayElement.style.opacity = '0.8';
            }
            // Future dates
            else {
                // Future dates are unclickable
                dayElement.style.cursor = 'default';
                dayElement.style.opacity = '0.8';
                
                if (workoutDays.includes(dateStr)) {
                    dayElement.classList.add('workout-day');
                    dayElement.style.backgroundColor = '#4CAF50';
                    dayElement.style.color = 'white';
                }
            }
            
            calendar.appendChild(dayElement);
        }
    }
    
    // Show workout schedule in new tab
    function showWorkoutSchedule(date) {
        const dayOfWeek = date.getDay();
        let scheduleTitle = "";
        switch(dayOfWeek) {
            case 0: scheduleTitle = "Rest Day"; break;
            case 1: scheduleTitle = "Chest/Tricep"; break;
            case 2: scheduleTitle = "Back/Bicep"; break;
            case 3: scheduleTitle = "Legs"; break;
            case 4: scheduleTitle = "Shoulders"; break;
            case 5: scheduleTitle = "Core/Abs"; break;
            case 6: scheduleTitle = "Full Body"; break;
        }
        // try
       
        switch(dayOfWeek) {
            case 0: // Sunday
                scheduleTitle = "Rest Day";
                exercises = [];
                break;
            case 1: // Monday - Chest/Tricep
                scheduleTitle = "Chest & Tricep Day";
                exercises = [
                    { name: "Bench Press", sets: "4", reps: "8-12", notes: "Barbell or Dumbbell" },
                    { name: "Incline Dumbbell Press", sets: "3", reps: "10-12", notes: "30-45 degree incline" },
                    { name: "Chest Fly", sets: "3", reps: "12-15", notes: "Machine or Cable" },
                    { name: "Tricep Dips", sets: "3", reps: "To failure", notes: "Assisted if needed" },
                    { name: "Tricep Rope Pushdown", sets: "3", reps: "12-15", notes: "Cable machine" }
                ];
                break;
            case 2: // Tuesday - Back/Bicep
                scheduleTitle = "Back & Bicep Day";
                exercises = [
                    { name: "Pull-Ups", sets: "4", reps: "To failure", notes: "Assisted if needed" },
                    { name: "Barbell Rows", sets: "4", reps: "8-12", notes: "Overhand grip" },
                    { name: "Lat Pulldown", sets: "3", reps: "10-12", notes: "Wide grip" },
                    { name: "Barbell Curls", sets: "3", reps: "10-12", notes: "Slow controlled movement" },
                    { name: "Hammer Curls", sets: "3", reps: "12-15", notes: "Dumbbells" }
                ];
                break;
            case 3: // Wednesday - Legs
                scheduleTitle = "Leg Day";
                exercises = [
                    { name: "Squats", sets: "4", reps: "8-12", notes: "Barbell back squats" },
                    { name: "Romanian Deadlifts", sets: "3", reps: "8-10", notes: "Focus on hamstrings" },
                    { name: "Leg Press", sets: "3", reps: "12-15", notes: "Feet shoulder-width" },
                    { name: "Leg Curls", sets: "3", reps: "12-15", notes: "Hamstring isolation" },
                    { name: "Calf Raises", sets: "4", reps: "15-20", notes: "Weighted or bodyweight" }
                ];
                break;
            case 4: // Thursday - Shoulders
                scheduleTitle = "Shoulder Day";
                exercises = [
                    { name: "Overhead Press", sets: "4", reps: "8-12", notes: "Barbell or Dumbbell" },
                    { name: "Lateral Raises", sets: "3", reps: "12-15", notes: "Light weight, controlled" },
                    { name: "Front Plate Raises", sets: "3", reps: "12-15", notes: "Weight plate" },
                    { name: "Rear Delt Fly", sets: "3", reps: "12-15", notes: "Machine or bent-over" },
                    { name: "Shrugs", sets: "3", reps: "12-15", notes: "Barbell or Dumbbell" }
                ];
                break;
            case 5: // Friday - Core/Abs
                scheduleTitle = "Core & Abs Day";
                exercises = [
                    { name: "Hanging Leg Raises", sets: "3", reps: "12-15", notes: "Slow and controlled" },
                    { name: "Cable Woodchoppers", sets: "3", reps: "12 each side", notes: "High to low" },
                    { name: "Plank", sets: "3", reps: "60 sec", notes: "Forearm or straight arm" },
                    { name: "Russian Twists", sets: "3", reps: "20 each side", notes: "Weighted if possible" },
                    { name: "Ab Wheel Rollouts", sets: "3", reps: "10-12", notes: "Kneeling or standing" }
                ];
                break;
            case 6: // Saturday - Full Body
                scheduleTitle = "Full Body Workout";
                exercises = [
                    { name: "Deadlifts", sets: "4", reps: "6-8", notes: "Heavy weight" },
                    { name: "Pull-Ups", sets: "3", reps: "To failure", notes: "Assisted if needed" },
                    { name: "Dumbbell Shoulder Press", sets: "3", reps: "10-12", notes: "Seated or standing" },
                    { name: "Bulgarian Split Squats", sets: "3", reps: "10 each leg", notes: "Dumbbells optional" },
                    { name: "Plank", sets: "3", reps: "60 sec", notes: "Core finisher" }
                ];
                break;
        }
        //try over
        const newTab = window.open('', '_blank');
        newTab.document.write(`
            <html>
                <head>
                    <title>${scheduleTitle}</title>
                    <style>
                        body {
                        font-family: 'Arial', sans-serif;
                        background-color: #1a1a1a;
                        color: #f0f0f0;
                        margin: 0;
                        padding: 20px;
                        line-height: 1.6;
                    }
                    .container {
                        max-width: 800px;
                        margin: 0 auto;
                        background-color: #2a2a2a;
                        padding: 30px;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                    }
                    h1 {
                        color: #4CAF50;
                        margin: 0 0 10px;
                        text-align: center;
                        font-size: 2.2rem;
                    }
                    .date {
                        color: #aaa;
                        font-size: 1.1rem;
                        text-align: center;
                        margin-bottom: 30px;
                        display: block;
                    }
                    .exercise {
                        background-color: #3a3a3a;
                        border-left: 4px solid #4CAF50;
                        padding: 15px;
                        margin-bottom: 15px;
                        border-radius: 4px;
                    }
                    .exercise-name {
                        font-weight: bold;
                        font-size: 1.2rem;
                        color: #4CAF50;
                        margin-bottom: 5px;
                    }
                    .exercise-details {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 5px;
                    }
                    .exercise-notes {
                        font-style: italic;
                        color: #bbb;
                        font-size: 0.9rem;
                    }
                    .rest-day {
                        text-align: center;
                        padding: 30px;
                        font-size: 1.3rem;
                    }
                    .rest-day-icon {
                        font-size: 3rem;
                        color: #4CAF50;
                        margin-bottom: 15px;
                    }
                    @media (max-width: 600px) {
                        .container {
                            padding: 15px;
                        }
                        h1 {
                            font-size: 1.8rem;
                        }
                    }
                    </style>
                </head>
                <body>
                 <div class="container">
                    <h1>${scheduleTitle}</h1>
                   <span class="date">${date.toDateString()}</span>
                    
                    ${dayOfWeek === 0 ? `
                        <div class="rest-day">
                            <div class="rest-day-icon">☀️</div>
                            <p>Today is your active recovery day!</p>
                            <p>Consider light activities like walking, stretching, or yoga.</p>
                        </div>
                    ` : ''}
                    
                    ${exercises.map(exercise => `
                        <div class="exercise">
                            <div class="exercise-name">${exercise.name}</div>
                            <div class="exercise-details">
                                <span>Sets: ${exercise.sets}</span>
                                <span>Reps: ${exercise.reps}</span>
                            </div>
                            ${exercise.notes ? `<div class="exercise-notes">${exercise.notes}</div>` : ''}
                        </div>
                    `).join('')}
                    
                    ${dayOfWeek !== 0 ? `
                        <div style="margin-top: 30px; text-align: center;">
                            <p>Remember to warm up before and stretch after your workout!</p>
                        </div>
                    ` : ''}
                </div>

                </body>
            </html>
        `);
        newTab.document.close();
    }
    
    // Month navigation
    prevMonthBtn.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar();
    });
    
    nextMonthBtn.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar();
    });
    
    // Initialize calendar
    generateCalendar();
  
    // Calorie counter functionality
    const foodForm = document.getElementById('food-form');
    const foodList = JSON.parse(localStorage.getItem('foodList')) || [];
    
    function updateNutritionTotals() {
        const totals = {
            calories: 0,
            protein: 0,
            fat: 0,
            carbs: 0
        };
        
        foodList.forEach(item => {
            totals.calories += item.calories;
            totals.protein += item.protein;
            totals.fat += item.fat;
            totals.carbs += item.carbs;
        });
        
        // Update display
        document.getElementById('total-calories').textContent = totals.calories;
        document.getElementById('total-protein').textContent = totals.protein;
        document.getElementById('total-fat').textContent = totals.fat;
        document.getElementById('total-carbs').textContent = totals.carbs;
        
        // Update graph
        const totalMacros = totals.protein + totals.fat + totals.carbs;
        if (totalMacros > 0) {
            document.getElementById('protein-bar').style.width = `${(totals.protein / totalMacros) * 100}%`;
            document.getElementById('fat-bar').style.width = `${(totals.fat / totalMacros) * 100}%`;
            document.getElementById('carbs-bar').style.width = `${(totals.carbs / totalMacros) * 100}%`;
            
            document.getElementById('protein-bar').textContent = `${Math.round((totals.protein / totalMacros) * 100)}%`;
            document.getElementById('fat-bar').textContent = `${Math.round((totals.fat / totalMacros) * 100)}%`;
            document.getElementById('carbs-bar').textContent = `${Math.round((totals.carbs / totalMacros) * 100)}%`;
        } else {
            document.getElementById('protein-bar').style.width = '0%';
            document.getElementById('fat-bar').style.width = '0%';
            document.getElementById('carbs-bar').style.width = '0%';
        }
        
        // Update food list
        const foodListElement = document.getElementById('food-list');
        foodListElement.innerHTML = '<h3>Food Items:</h3>';
        
        foodList.forEach((item, index) => {
            const foodItem = document.createElement('div');
            foodItem.classList.add('food-item');
            foodItem.innerHTML = `
                <span>${item.name} (${item.calories} kcal)</span>
                <button class="delete-btn" data-index="${index}">×</button>
            `;
            foodListElement.appendChild(foodItem);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                foodList.splice(index, 1);
                localStorage.setItem('foodList', JSON.stringify(foodList));
                updateNutritionTotals();
            });
        });
    }
    
    // Handle form submission
    foodForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const foodItem = {
            name: document.getElementById('food-name').value,
            calories: parseInt(document.getElementById('food-calories').value),
            protein: parseInt(document.getElementById('food-protein').value),
            fat: parseInt(document.getElementById('food-fat').value),
            carbs: parseInt(document.getElementById('food-carbs').value),
            date: new Date().toLocaleDateString()
        };
        
        foodList.push(foodItem);
        localStorage.setItem('foodList', JSON.stringify(foodList));
        updateNutritionTotals();
        this.reset();
    });
    
    // Initialize nutrition totals
    updateNutritionTotals();
  });
  
  document.addEventListener('DOMContentLoaded', function() {
      const menuToggle = document.createElement('div');
      menuToggle.className = 'menu-toggle';
      menuToggle.innerHTML = '<span></span><span></span><span></span>';
      
      const header = document.querySelector('.header');
      const navigation = document.querySelector('.navigation');
      
      // Insert the menu toggle button
      header.insertBefore(menuToggle, navigation);
      
      
      // Toggle menu on click
      menuToggle.addEventListener('click', function() {
          this.classList.toggle('active');
          navigation.classList.toggle('active');
      });
  });

  // as

  

  