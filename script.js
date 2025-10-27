// Initialize progress tracking
let currentStep = 0;
const totalSteps = 7;

// Chart instances
let lossChart, accuracyChart;

// Quiz variables
let currentQuestion = 0;
let score = 0;
let quizAnswers = [];
let quizCompleted = false;

// Training simulation variables
let trainingInterval;
let epoch = 0;
let lossHistory = [];
let accuracyHistory = [];

// Quiz questions with explanations
const quizQuestions = [
    {
        question: "Which of the following is NOT a step in the ML training pipeline?",
        answers: [
            "Data Collection",
            "Model Training",
            "Database Design",
            "Model Evaluation"
        ],
        correct: 2,
        explanation: "Database design is not a standard step in the ML training pipeline. The typical steps include data collection, preprocessing, model selection, training, evaluation, and deployment."
    },
    {
        question: "What is the typical purpose of a validation set?",
        answers: [
            "To train the model",
            "To tune hyperparameters",
            "To collect more data",
            "To deploy the model"
        ],
        correct: 1,
        explanation: "A validation set is used to tune hyperparameters and make decisions about model architecture without using the test set, which should only be used for final evaluation."
    },
    {
        question: "What does 'overfitting' mean in ML?",
        answers: [
            "Model performs poorly on training data",
            "Model performs well on training data but poorly on new data",
            "Model takes too long to train",
            "Model uses too few features"
        ],
        correct: 1,
        explanation: "Overfitting occurs when a model learns the training data too well, including noise and random fluctuations, resulting in poor performance on new, unseen data."
    },
    {
        question: "Which metric is most appropriate for imbalanced classification problems?",
        answers: [
            "Accuracy",
            "Precision",
            "F1-Score",
            "Mean Squared Error"
        ],
        correct: 2,
        explanation: "F1-Score is most appropriate for imbalanced classification problems as it balances both precision and recall, providing a better measure of performance than accuracy when classes are imbalanced."
    },
    {
        question: "What is the primary purpose of cross-validation?",
        answers: [
            "Speed up training",
            "Reduce memory usage",
            "Assess model generalization",
            "Increase dataset size"
        ],
        correct: 2,
        explanation: "Cross-validation is primarily used to assess how well a model will generalize to an independent dataset. It provides a more robust evaluation than a single train-test split."
    }
];

// Code examples
const codeExamples = {
    data_prep: `# Data Preparation Example
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

# Load data
df = pd.read_csv('data.csv')

# Handle missing values
df.fillna(df.mean(), inplace=True)

# Feature engineering
df['new_feature'] = df['feature1'] * df['feature2']

# Normalize features
scaler = StandardScaler()
scaled_features = scaler.fit_transform(df[['feature1', 'feature2']])`,

    data_split: `# Data Splitting Example
from sklearn.model_selection import train_test_split

# Split data into train and test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Further split training data for validation
X_train, X_val, y_train, y_val = train_test_split(
    X_train, y_train, test_size=0.25, random_state=42
)

print(f"Training set: {len(X_train)} samples")
print(f"Validation set: {len(X_val)} samples")
print(f"Test set: {len(X_test)} samples")`,

    model_selection: `# Model Selection Example
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC

# Initialize models
models = {
    'Random Forest': RandomForestClassifier(n_estimators=100),
    'Logistic Regression': LogisticRegression(),
    'SVM': SVC(kernel='rbf')
}

# Train and evaluate each model
for name, model in models.items():
    model.fit(X_train, y_train)
    score = model.score(X_val, y_val)
    print(f"{name}: {score:.4f}")`
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateProgress();
    initCharts();
    initQuiz();
    loadDarkModePreference();
    initEventListeners();
});

// Initialize event listeners
function initEventListeners() {
    // Update learning rate display
    document.getElementById('learningRate').addEventListener('input', function(e) {
        document.getElementById('lrValue').textContent = e.target.value;
    });
    
    // Close modals when clicking outside
    document.getElementById('codeModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeCodeModal();
        }
    });
    
    document.getElementById('vizModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeVizModal();
        }
    });
}

// Update progress bar on scroll
function updateProgress() {
    const stepCards = document.querySelectorAll('.step-card');
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    stepCards.forEach((card, index) => {
        const cardTop = card.offsetTop;
        const cardBottom = cardTop + card.offsetHeight;
        
        if (scrollPosition >= cardTop && scrollPosition <= cardBottom) {
            currentStep = index + 1;
            updateProgressBar();
        }
    });
}

function updateProgressBar() {
    const progress = (currentStep / totalSteps) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('progressText').textContent = Math.round(progress) + '%';
}

window.addEventListener('scroll', updateProgress);

// Mobile menu toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden');
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: 'smooth' });
}

// Dark mode toggle
document.getElementById('darkModeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const icon = this.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('darkMode', 'disabled');
    }
});

function loadDarkModePreference() {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeToggle').querySelector('i').classList.remove('fa-moon');
        document.getElementById('darkModeToggle').querySelector('i').classList.add('fa-sun');
    }
}

// Code examples
function showCodeExample(type) {
    const modal = document.getElementById('codeModal');
    const content = document.getElementById('codeContent');
    content.innerHTML = '<pre><code class="language-python">' + codeExamples[type] + '</code></pre>';
    modal.classList.remove('hidden');
    Prism.highlightAll();
}

function closeCodeModal() {
    document.getElementById('codeModal').classList.add('hidden');
}

function copyCode() {
    const codeText = document.querySelector('#codeContent code').textContent;
    navigator.clipboard.writeText(codeText).then(() => {
        showNotification('Code copied to clipboard!');
    });
}

// Visualization functions
function showVisualization(type) {
    const modal = document.getElementById('vizModal');
    const title = document.getElementById('vizTitle');
    const content = document.getElementById('vizContent');
    
    title.textContent = "Data Visualization";
    content.innerHTML = 
        '<div class="bg-gray-100 p-4 rounded-lg">' +
            '<h4 class="font-semibold mb-2">Sample Dataset Distribution</h4>' +
            '<canvas id="dataVizChart" width="400" height="200"></canvas>' +
        '</div>' +
        '<div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">' +
            '<div class="bg-blue-50 p-4 rounded-lg">' +
                '<h5 class="font-semibold mb-2">Feature Correlations</h5>' +
                '<div class="grid grid-cols-3 gap-2">';
    
    // Generate correlation cells
    for (let i = 0; i < 9; i++) {
        content.innerHTML += '<div class="bg-white p-2 text-center rounded matrix-cell">' + (Math.random() * 2 - 1).toFixed(2) + '</div>';
    }
    
    content.innerHTML += 
                '</div>' +
            '</div>' +
            '<div class="bg-green-50 p-4 rounded-lg">' +
                '<h5 class="font-semibold mb-2">Class Distribution</h5>' +
                '<div class="space-y-2">' +
                    '<div>' +
                        '<div class="flex justify-between">' +
                            '<span>Class A</span>' +
                            '<span>42%</span>' +
                        '</div>' +
                        '<div class="bg-gray-200 rounded-full h-2">' +
                            '<div class="bg-blue-500 h-2 rounded-full" style="width: 42%"></div>' +
                        '</div>' +
                    '</div>' +
                    '<div>' +
                        '<div class="flex justify-between">' +
                            '<span>Class B</span>' +
                            '<span>33%</span>' +
                        '</div>' +
                        '<div class="bg-gray-200 rounded-full h-2">' +
                            '<div class="bg-green-500 h-2 rounded-full" style="width: 33%"></div>' +
                        '</div>' +
                    '</div>' +
                    '<div>' +
                        '<div class="flex justify-between">' +
                            '<span>Class C</span>' +
                            '<span>25%</span>' +
                        '</div>' +
                        '<div class="bg-gray-200 rounded-full h-2">' +
                            '<div class="bg-purple-500 h-2 rounded-full" style="width: 25%"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
    modal.classList.remove('hidden');
    
    // Create a simple bar chart
    setTimeout(() => {
        const ctx = document.getElementById('dataVizChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5'],
                datasets: [{
                    label: 'Average Values',
                    data: [12, 19, 8, 15, 10],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }, 100);
}

function showSplitVisualization() {
    const modal = document.getElementById('vizModal');
    const title = document.getElementById('vizTitle');
    const content = document.getElementById('vizContent');
    
    title.textContent = "Data Split Visualization";
    content.innerHTML = 
        '<div class="text-center">' +
            '<div class="inline-block relative w-48 h-48 mx-auto">' +
                '<div class="absolute inset-0 rounded-full border-4 border-blue-500"></div>' +
                '<div class="absolute inset-4 rounded-full border-4 border-green-500"></div>' +
                '<div class="absolute inset-8 rounded-full border-4 border-orange-500"></div>' +
                
                '<div class="absolute inset-0 flex items-center justify-center">' +
                    '<div class="text-center">' +
                        '<div class="text-xl font-bold">100%</div>' +
                        '<div class="text-xs">Total Dataset</div>' +
                    '</div>' +
                '</div>' +
                
                '<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24">' +
                    '<div class="absolute inset-0 rounded-full border-2 border-blue-500 animate-pulse"></div>' +
                '</div>' +
                
                '<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16">' +
                    '<div class="absolute inset-0 rounded-full border-2 border-green-500 animate-pulse"></div>' +
                '</div>' +
            '</div>' +
            
            '<div class="grid grid-cols-3 gap-2 mt-6 max-w-md mx-auto">' +
                '<div class="bg-blue-100 p-2 rounded-lg">' +
                    '<div class="text-lg font-bold text-blue-600">70%</div>' +
                    '<div class="text-xs">Training</div>' +
                '</div>' +
                '<div class="bg-green-100 p-2 rounded-lg">' +
                    '<div class="text-lg font-bold text-green-600">15%</div>' +
                    '<div class="text-xs">Validation</div>' +
                '</div>' +
                '<div class="bg-orange-100 p-2 rounded-lg">' +
                    '<div class="text-lg font-bold text-orange-600">15%</div>' +
                    '<div class="text-xs">Test</div>' +
                '</div>' +
            '</div>' +
        '</div>';
    modal.classList.remove('hidden');
}

function closeVizModal() {
    document.getElementById('vizModal').classList.add('hidden');
    // Clear the content when closing to free up resources
    document.getElementById('vizContent').innerHTML = '';
}

// Training simulation
function initCharts() {
    const lossCtx = document.getElementById('lossChart').getContext('2d');
    const accCtx = document.getElementById('accuracyChart').getContext('2d');
    
    lossChart = new Chart(lossCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Loss',
                data: [],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    accuracyChart = new Chart(accCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Accuracy',
                data: [],
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1
                }
            }
        }
    });
}

function runTrainingSimulation() {
    const epochs = parseInt(document.getElementById('epochs').value);
    const learningRate = parseFloat(document.getElementById('learningRate').value);
    
    // Reset
    epoch = 0;
    lossHistory = [];
    accuracyHistory = [];
    lossChart.data.labels = [];
    lossChart.data.datasets[0].data = [];
    accuracyChart.data.labels = [];
    accuracyChart.data.datasets[0].data = [];
    lossChart.update();
    accuracyChart.update();
    
    // Clear log
    const logElement = document.getElementById('trainingLog');
    logElement.innerHTML = '> Starting training simulation...<br>';
    
    // Clear previous interval
    if (trainingInterval) {
        clearInterval(trainingInterval);
    }
    
    // Start training simulation
    trainingInterval = setInterval(() => {
        if (epoch >= epochs) {
            clearInterval(trainingInterval);
            showTrainingComplete();
            addToLog('> Training completed!');
            return;
        }
        
        epoch++;
        
        // Simulate loss decrease
        const loss = Math.max(0.01, 2.0 * Math.exp(-epoch * learningRate * 10) + Math.random() * 0.1);
        lossHistory.push(loss);
        
        // Simulate accuracy increase
        const accuracy = Math.min(0.99, 0.5 + (1 - Math.exp(-epoch * learningRate * 5)) + Math.random() * 0.05);
        accuracyHistory.push(accuracy);
        
        // Update UI
        document.getElementById('currentLoss').textContent = loss.toFixed(3);
        document.getElementById('currentAccuracy').textContent = (accuracy * 100).toFixed(1) + '%';
        document.getElementById('lossBar').style.width = (loss * 50) + '%';
        document.getElementById('accuracyBar').style.width = (accuracy * 100) + '%';
        
        // Update charts
        updateCharts(epoch, loss, accuracy);
        
        // Update log
        addToLog('> Epoch ' + epoch + ': Loss=' + loss.toFixed(4) + ', Accuracy=' + (accuracy * 100).toFixed(2) + '%');
        
    }, 500);
}

function resetTraining() {
    if (trainingInterval) {
        clearInterval(trainingInterval);
    }
    
    epoch = 0;
    lossHistory = [];
    accuracyHistory = [];
    
    document.getElementById('currentLoss').textContent = '0.000';
    document.getElementById('currentAccuracy').textContent = '0%';
    document.getElementById('lossBar').style.width = '100%';
    document.getElementById('accuracyBar').style.width = '0%';
    
    lossChart.data.labels = [];
    lossChart.data.datasets[0].data = [];
    accuracyChart.data.labels = [];
    accuracyChart.data.datasets[0].data = [];
    lossChart.update();
    accuracyChart.update();
    
    document.getElementById('trainingLog').innerHTML = '> Training simulation reset<br>> Adjust parameters and click Start Training<br>';
}

function updateCharts(epoch, loss, accuracy) {
    // Update loss chart
    lossChart.data.labels.push(epoch);
    lossChart.data.datasets[0].data.push(loss);
    lossChart.update();
    
    // Update accuracy chart
    accuracyChart.data.labels.push(epoch);
    accuracyChart.data.datasets[0].data.push(accuracy);
    accuracyChart.update();
}

function addToLog(message) {
    const logElement = document.getElementById('trainingLog');
    logElement.innerHTML += message + '<br>';
    logElement.scrollTop = logElement.scrollHeight;
}

function showTrainingComplete() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = 
        '<div class="modal-content bg-white rounded-lg p-8 max-w-md">' +
            '<div class="text-center">' +
                '<i class="fas fa-check-circle text-green-500 text-5xl mb-4"></i>' +
                '<h3 class="text-2xl font-bold mb-2">Training Complete!</h3>' +
                '<p class="text-gray-600 mb-4">Your model has been successfully trained.</p>' +
                '<div class="bg-gray-100 rounded-lg p-4 mb-4">' +
                    '<div class="flex justify-between mb-2">' +
                        '<span>Final Loss:</span>' +
                        '<span class="font-semibold">' + lossHistory[lossHistory.length-1].toFixed(4) + '</span>' +
                    '</div>' +
                    '<div class="flex justify-between">' +
                        '<span>Final Accuracy:</span>' +
                        '<span class="font-semibold">' + (accuracyHistory[accuracyHistory.length-1] * 100).toFixed(2) + '%</span>' +
                    '</div>' +
                '</div>' +
                '<div class="flex justify-center space-x-4">' +
                    '<button onclick="this.parentElement.parentElement.parentElement.remove()" ' +
                            'class="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">' +
                        'Close' +
                    '</button>' +
                    '<button onclick="this.parentElement.parentElement.parentElement.remove(); scrollToSection(\'steps\');" ' +
                            'class="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700">' +
                        '<i class="fas fa-arrow-left mr-2"></i>Go Back to Steps' +
                    '</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Additional interactive functions
function startTrainingDemo() {
    scrollToSection('demo');
    setTimeout(() => runTrainingSimulation(), 500);
}

function showHyperparameterDemo() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = 
        '<div class="modal-content bg-white rounded-lg p-8 max-w-2xl max-h-[80vh] overflow-y-auto">' +
            '<div class="flex justify-between items-center mb-4">' +
                '<h3 class="text-xl font-semibold">Hyperparameter Tuning</h3>' +
                '<button onclick="this.parentElement.parentElement.parentElement.remove()" class="text-gray-500 hover:text-gray-700">' +
                    '<i class="fas fa-times text-xl"></i>' +
                '</button>' +
            '</div>' +
            '<div class="space-y-6">' +
                '<div>' +
                    '<h4 class="font-semibold mb-2">Learning Rate</h4>' +
                    '<p class="text-gray-600 mb-2">Controls how much to change the model in response to the estimated error each time the model weights are updated.</p>' +
                    '<div class="grid grid-cols-3 gap-2">' +
                        '<div class="bg-red-50 p-2 rounded text-center">0.001 (Slow)</div>' +
                        '<div class="bg-green-50 p-2 rounded text-center">0.01 (Recommended)</div>' +
                        '<div class="bg-yellow-50 p-2 rounded text-center">0.1 (Fast)</div>' +
                    '</div>' +
                '</div>' +
                '<div>' +
                    '<h4 class="font-semibold mb-2">Batch Size</h4>' +
                    '<p class="text-gray-600 mb-2">Number of training examples utilized in one iteration.</p>' +
                    '<div class="grid grid-cols-3 gap-2">' +
                        '<div class="bg-blue-50 p-2 rounded text-center">16 (Small)</div>' +
                        '<div class="bg-blue-50 p-2 rounded text-center">32 (Medium)</div>' +
                        '<div class="bg-blue-50 p-2 rounded text-center">64+ (Large)</div>' +
                    '</div>' +
                '</div>' +
                '<div>' +
                    '<h4 class="font-semibold mb-2">Regularization</h4>' +
                    '<p class="text-gray-600 mb-2">Technique to discourage model complexity and prevent overfitting.</p>' +
                    '<div class="grid grid-cols-2 gap-2">' +
                        '<div class="bg-purple-50 p-2 rounded text-center">L1 (Lasso)</div>' +
                        '<div class="bg-purple-50 p-2 rounded text-center">L2 (Ridge)</div>' +
                    '</div>' +
                '</div>' +
                '<div class="bg-gray-100 p-4 rounded-lg">' +
                    '<h4 class="font-semibold mb-2">Tips for Tuning:</h4>' +
                    '<ul class="list-disc list-inside text-gray-600 space-y-1">' +
                        '<li>Start with default values</li>' +
                        '<li>Change one parameter at a time</li>' +
                        '<li>Use validation set to evaluate changes</li>' +
                        '<li>Consider automated methods like Grid Search or Random Search</li>' +
                    '</ul>' +
                '</div>' +
            '</div>' +
            '<div class="mt-6 flex justify-end">' +
                '<button onclick="this.parentElement.parentElement.parentElement.remove()" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">' +
                    'Close' +
                '</button>' +
            '</div>' +
        '</div>';
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function showEvaluationMetrics() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = 
        '<div class="modal-content bg-white rounded-lg p-8 max-w-4xl max-h-[80vh] overflow-y-auto">' +
            '<div class="flex justify-between items-center mb-4">' +
                '<h3 class="text-xl font-semibold">Model Evaluation Metrics</h3>' +
                '<button onclick="this.parentElement.parentElement.parentElement.remove()" class="text-gray-500 hover:text-gray-700">' +
                    '<i class="fas fa-times text-xl"></i>' +
                '</button>' +
            '</div>' +
            '<div class="grid grid-cols-1 md:grid-cols-2 gap-6">' +
                '<div>' +
                    '<h4 class="font-semibold mb-2">Classification Metrics</h4>' +
                    '<div class="space-y-3">' +
                        '<div class="bg-gray-50 p-3 rounded">' +
                            '<div class="flex justify-between mb-1">' +
                                '<span>Accuracy</span>' +
                                '<span class="font-semibold">0.95</span>' +
                            '</div>' +
                            '<div class="bg-gray-200 rounded-full h-2">' +
                                '<div class="bg-purple-500 h-2 rounded-full" style="width: 95%"></div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="bg-gray-50 p-3 rounded">' +
                            '<div class="flex justify-between mb-1">' +
                                '<span>Precision</span>' +
                                '<span class="font-semibold">0.92</span>' +
                            '</div>' +
                            '<div class="bg-gray-200 rounded-full h-2">' +
                                '<div class="bg-blue-500 h-2 rounded-full" style="width: 92%"></div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="bg-gray-50 p-3 rounded">' +
                            '<div class="flex justify-between mb-1">' +
                                '<span>Recall</span>' +
                                '<span class="font-semibold">0.88</span>' +
                            '</div>' +
                            '<div class="bg-gray-200 rounded-full h-2">' +
                                '<div class="bg-green-500 h-2 rounded-full" style="width: 88%"></div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="bg-gray-50 p-3 rounded">' +
                            '<div class="flex justify-between mb-1">' +
                                '<span>F1-Score</span>' +
                                '<span class="font-semibold">0.90</span>' +
                            '</div>' +
                            '<div class="bg-gray-200 rounded-full h-2">' +
                                '<div class="bg-yellow-500 h-2 rounded-full" style="width: 90%"></div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div>' +
                    '<h4 class="font-semibold mb-2">Confusion Matrix</h4>' +
                    '<div class="bg-gray-50 p-4 rounded">' +
                        '<table class="w-full text-center">' +
                            '<thead>' +
                                '<tr>' +
                                    '<th class="p-2"></th>' +
                                    '<th class="p-2">Pred: 0</th>' +
                                    '<th class="p-2">Pred: 1</th>' +
                                '</tr>' +
                            '</thead>' +
                            '<tbody>' +
                                '<tr>' +
                                    '<td class="p-2 font-semibold">True: 0</td>' +
                                    '<td class="p-2 bg-green-100">85</td>' +
                                    '<td class="p-2 bg-red-100">5</td>' +
                                '</tr>' +
                                '<tr>' +
                                    '<td class="p-2 font-semibold">True: 1</td>' +
                                    '<td class="p-2 bg-red-100">10</td>' +
                                    '<td class="p-2 bg-green-100">80</td>' +
                                '</tr>' +
                            '</tbody>' +
                        '</table>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="mt-6">' +
                '<h4 class="font-semibold mb-2">ROC Curve</h4>' +
                '<canvas id="rocChart" width="400" height="200"></canvas>' +
            '</div>' +
            '<div class="mt-6 flex justify-end">' +
                '<button onclick="this.parentElement.parentElement.parentElement.remove()" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">' +
                    'Close' +
                '</button>' +
            '</div>' +
        '</div>';
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('show');
        
        // Create ROC chart
        const ctx = document.getElementById('rocChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
                datasets: [
                    {
                        label: 'ROC Curve',
                        data: [0, 0.05, 0.15, 0.3, 0.5, 0.7, 0.85, 0.92, 0.96, 0.98, 1],
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: 'Random Classifier',
                        data: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
                        borderColor: 'rgb(54, 162, 235)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'False Positive Rate'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'True Positive Rate'
                        }
                    }
                }
            }
        });
    }, 10);
}

function showDeploymentGuide() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = 
        '<div class="modal-content bg-white rounded-lg p-8 max-w-3xl max-h-[80vh] overflow-y-auto">' +
            '<div class="flex justify-between items-center mb-4">' +
                '<h3 class="text-xl font-semibold">Model Deployment Guide</h3>' +
                '<button onclick="this.parentElement.parentElement.parentElement.remove()" class="text-gray-500 hover:text-gray-700">' +
                    '<i class="fas fa-times text-xl"></i>' +
                '</button>' +
            '</div>' +
            '<div class="space-y-6">' +
                '<div>' +
                    '<h4 class="font-semibold mb-2">1. Containerize Your Model</h4>' +
                    '<p class="text-gray-600 mb-2">Package your model with all dependencies using Docker:</p>' +
                    '<div class="bg-gray-100 p-3 rounded font-mono text-sm">' +
                        'FROM python:3.8-slim<br>' +
                        'WORKDIR /app<br>' +
                        'COPY requirements.txt .<br>' +
                        'RUN pip install -r requirements.txt<br>' +
                        'COPY model.py .<br>' +
                        'CMD ["python", "model.py"]' +
                    '</div>' +
                '</div>' +
                '<div>' +
                    '<h4 class="font-semibold mb-2">2. Choose Deployment Platform</h4>' +
                    '<div class="grid grid-cols-1 md:grid-cols-3 gap-3">' +
                        '<div class="bg-blue-50 p-3 rounded">' +
                            '<h5 class="font-semibold text-blue-600">Cloud Services</h5>' +
                            '<ul class="text-sm text-gray-600 mt-1">' +
                                '<li>• AWS SageMaker</li>' +
                                '<li>• Google AI Platform</li>' +
                                '<li>• Azure ML</li>' +
                            '</ul>' +
                        '</div>' +
                        '<div class="bg-green-50 p-3 rounded">' +
                            '<h5 class="font-semibold text-green-600">Serverless</h5>' +
                            '<ul class="text-sm text-gray-600 mt-1">' +
                                '<li>• AWS Lambda</li>' +
                                '<li>• Google Cloud Functions</li>' +
                                '<li>• Azure Functions</li>' +
                            '</ul>' +
                        '</div>' +
                        '<div class="bg-purple-50 p-3 rounded">' +
                            '<h5 class="font-semibold text-purple-600">Edge Computing</h5>' +
                            '<ul class="text-sm text-gray-600 mt-1">' +
                                '<li>• TensorFlow Lite</li>' +
                                '<li>• ONNX Runtime</li>' +
                                '<li>• Core ML</li>' +
                            '</ul>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div>' +
                    '<h4 class="font-semibold mb-2">3. Create API Endpoint</h4>' +
                    '<p class="text-gray-600 mb-2">Expose your model through a REST API:</p>' +
                    '<div class="bg-gray-100 p-3 rounded font-mono text-sm">' +
                        'from flask import Flask, request, jsonify<br>' +
                        'import joblib<br><br>' +
                        'app = Flask(__name__)<br>' +
                        'model = joblib.load("model.pkl")<br><br>' +
                        '@app.route("/predict", methods=["POST"])<br>' +
                        'def predict():<br>' +
                        '    data = request.json<br>' +
                        '    prediction = model.predict(data)<br>' +
                        '    return jsonify({"prediction": prediction.tolist()})' +
                    '</div>' +
                '</div>' +
                '<div>' +
                    '<h4 class="font-semibold mb-2">4. Monitor Performance</h4>' +
                    '<p class="text-gray-600 mb-2">Set up monitoring to track model performance in production:</p>' +
                    '<ul class="list-disc list-inside text-gray-600">' +
                        '<li>Track prediction accuracy over time</li>' +
                        '<li>Monitor response times</li>' +
                        '<li>Set up alerts for performance degradation</li>' +
                        '<li>Log prediction requests and results</li>' +
                    '</ul>' +
                '</div>' +
            '</div>' +
            '<div class="mt-6 flex justify-end">' +
                '<button onclick="this.parentElement.parentElement.parentElement.remove()" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">' +
                    'Close' +
                '</button>' +
            '</div>' +
        '</div>';
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function showModelComparison() {
    const modal = document.getElementById('vizModal');
    const title = document.getElementById('vizTitle');
    const content = document.getElementById('vizContent');
    
    title.textContent = "Model Comparison";
    content.innerHTML = 
        '<div class="overflow-x-auto">' +
            '<table class="min-w-full bg-white text-sm">' +
                '<thead>' +
                    '<tr>' +
                        '<th class="py-1 px-2 bg-gray-100 border-b text-left">Model</th>' +
                        '<th class="py-1 px-2 bg-gray-100 border-b text-right">Accuracy</th>' +
                        '<th class="py-1 px-2 bg-gray-100 border-b text-right">F1-Score</th>' +
                        '<th class="py-1 px-2 bg-gray-100 border-b text-right">Time</th>' +
                    '</tr>' +
                '</thead>' +
                '<tbody>' +
                    '<tr>' +
                        '<td class="py-1 px-2 border-b">Logistic Regression</td>' +
                        '<td class="py-1 px-2 border-b text-right">0.85</td>' +
                        '<td class="py-1 px-2 border-b text-right">0.85</td>' +
                        '<td class="py-1 px-2 border-b text-right">2.3s</td>' +
                    '</tr>' +
                    '<tr class="bg-blue-50">' +
                        '<td class="py-1 px-2 border-b font-semibold">Random Forest</td>' +
                        '<td class="py-1 px-2 border-b font-semibold text-right">0.92</td>' +
                        '<td class="py-1 px-2 border-b font-semibold text-right">0.92</td>' +
                        '<td class="py-1 px-2 border-b text-right">15.7s</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td class="py-1 px-2 border-b">SVM</td>' +
                        '<td class="py-1 px-2 border-b text-right">0.89</td>' +
                        '<td class="py-1 px-2 border-b text-right">0.89</td>' +
                        '<td class="py-1 px-2 border-b text-right">8.4s</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td class="py-1 px-2 border-b">Neural Network</td>' +
                        '<td class="py-1 px-2 border-b text-right">0.94</td>' +
                        '<td class="py-1 px-2 border-b text-right">0.94</td>' +
                        '<td class="py-1 px-2 border-b text-right">42.1s</td>' +
                    '</tr>' +
                '</tbody>' +
            '</table>' +
        '</div>' +
        '<div class="mt-4">' +
            '<h4 class="font-semibold mb-2 text-sm">Performance Comparison</h4>' +
            '<canvas id="modelComparisonChart" width="400" height="150"></canvas>' +
        '</div>';
    modal.classList.remove('hidden');
    
    // Create comparison chart
    setTimeout(() => {
        const ctx = document.getElementById('modelComparisonChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Logistic Regression', 'Random Forest', 'SVM', 'Neural Network'],
                datasets: [
                    {
                        label: 'Accuracy',
                        data: [0.85, 0.92, 0.89, 0.94],
                        backgroundColor: 'rgba(54, 162, 235, 0.5)'
                    },
                    {
                        label: 'F1-Score',
                        data: [0.85, 0.92, 0.89, 0.94],
                        backgroundColor: 'rgba(255, 99, 132, 0.5)'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 1
                    }
                }
            }
        });
    }, 100);
}

// Resource functions
function downloadResource(filename) {
    showNotification(`Downloading ${filename}...`);
    
    // Simulate download
    setTimeout(() => {
        showNotification(`${filename} downloaded successfully!`);
    }, 1500);
}

function downloadAllDocs() {
    showNotification("Preparing documentation bundle...");
    
    // Simulate download
    setTimeout(() => {
        showNotification("Documentation bundle downloaded successfully!");
    }, 2000);
}

function downloadAllCode() {
    showNotification("Preparing code examples bundle...");
    
    // Simulate download
    setTimeout(() => {
        showNotification("Code examples bundle downloaded successfully!");
    }, 2000);
}

function showPlaylist() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = 
        '<div class="modal-content bg-white rounded-lg p-8 max-w-3xl max-h-[80vh] overflow-y-auto">' +
            '<div class="flex justify-between items-center mb-4">' +
                '<h3 class="text-xl font-semibold">ML Video Course Playlist</h3>' +
                '<button onclick="this.parentElement.parentElement.parentElement.remove()" class="text-gray-500 hover:text-gray-700">' +
                    '<i class="fas fa-times text-xl"></i>' +
                '</button>' +
            '</div>' +
            '<div class="space-y-4">' +
                '<div class="bg-gray-50 p-4 rounded-lg">' +
                    '<h4 class="font-semibold mb-2">Beginner Level</h4>' +
                    '<ul class="space-y-2">' +
                        '<li class="flex items-center">' +
                            '<i class="fab fa-youtube text-red-500 mr-2"></i>' +
                            '<a href="https://www.coursera.org/learn/machine-learning" target="_blank" class="text-blue-600 hover:underline">Andrew Ng\'s Machine Learning Course</a>' +
                        '</li>' +
                        '<li class="flex items-center">' +
                            '<i class="fab fa-youtube text-red-500 mr-2"></i>' +
                            '<a href="https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU" target="_blank" class="text-blue-600 hover:underline">StatQuest with Josh Starmer</a>' +
                        '</li>' +
                    '</ul>' +
                '</div>' +
                '<div class="bg-gray-50 p-4 rounded-lg">' +
                    '<h4 class="font-semibold mb-2">Intermediate Level</h4>' +
                    '<ul class="space-y-2">' +
                        '<li class="flex items-center">' +
                            '<i class="fab fa-youtube text-red-500 mr-2"></i>' +
                            '<a href="https://course.fast.ai/" target="_blank" class="text-blue-600 hover:underline">Fast.ai Practical Deep Learning</a>' +
                        '</li>' +
                        '<li class="flex items-center">' +
                            '<i class="fab fa-youtube text-red-500 mr-2"></i>' +
                            '<a href="https://www.youtube.com/playlist?list=PLkDaE6sC856Eto2Pkxl1OvEX7oF2AE2cI" target="_blank" class="text-blue-600 hover:underline">DeepLearning.AI Specialization</a>' +
                        '</li>' +
                    '</ul>' +
                '</div>' +
                '<div class="bg-gray-50 p-4 rounded-lg">' +
                    '<h4 class="font-semibold mb-2">Advanced Level</h4>' +
                    '<ul class="space-y-2">' +
                        '<li class="flex items-center">' +
                            '<i class="fab fa-youtube text-red-500 mr-2"></i>' +
                            '<a href="http://cs231n.stanford.edu/" target="_blank" class="text-blue-600 hover:underline">CS231n: Convolutional Neural Networks</a>' +
                        '</li>' +
                        '<li class="flex items-center">' +
                            '<i class="fab fa-youtube text-red-500 mr-2"></i>' +
                            '<a href="https://www.youtube.com/playlist?list=PLoROMvodv4rOSH4v6133s9LFPRHjEmbmJ" target="_blank" class="text-blue-600 hover:underline">CS224n: Natural Language Processing</a>' +
                        '</li>' +
                    '</ul>' +
                '</div>' +
            '</div>' +
            '<div class="mt-6 flex justify-end">' +
                '<button onclick="this.parentElement.parentElement.parentElement.remove()" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">' +
                    'Close' +
                '</button>' +
            '</div>' +
        '</div>';
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Exercise functions
function showExercise(exerciseId) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    let exerciseContent = '';
    
    if (exerciseId === 'exercise1') {
        exerciseContent = 
            '<div class="space-y-4">' +
                '<div>' +
                    '<h4 class="font-semibold mb-2">Exercise 1: Data Preprocessing</h4>' +
                    '<p class="text-gray-600 mb-4">In this exercise, you\'ll practice preprocessing a dataset by handling missing values, scaling features, and encoding categorical variables.</p>' +
                '</div>' +
                '<div>' +
                    '<h4 class="font-semibold mb-2">Instructions:</h4>' +
                    '<ol class="list-decimal list-inside text-gray-600 space-y-1">' +
                        '<li>Load the provided dataset</li>' +
                        '<li>Identify and handle missing values</li>' +
                        '<li>Scale numerical features</li>' +
                        '<li>Encode categorical variables</li>' +
                        '<li>Split the data into training and testing sets</li>' +
                    '</ol>' +
                '</div>' +
                '<div>' +
                    '<h4 class="font-semibold mb-2">Starter Code:</h4>' +
                    '<div class="bg-gray-100 p-3 rounded font-mono text-sm overflow-x-auto">' +
                        'import pandas as pd<br>' +
                        'import numpy as np<br>' +
                        'from sklearn.model_selection import train_test_split<br>' +
                        'from sklearn.preprocessing import StandardScaler, OneHotEncoder<br><br>' +
                        '# Load the dataset<br>' +
                        'df = pd.read_csv("dataset.csv")<br><br>' +
                        '# Your code here...' +
                    '</div>' +
                '</div>' +
                '<div>' +
                    '<h4 class="font-semibold mb-2">Expected Output:</h4>' +
                    '<div class="bg-gray-100 p-3 rounded font-mono text-sm">' +
                        'Training set shape: (800, 10)<br>' +
                        'Testing set shape: (200, 10)<br>' +
                        'Missing values handled: 45<br>' +
                        'Features scaled: 6<br>' +
                        'Categorical features encoded: 4' +
                    '</div>' +
                '</div>' +
            '</div>';
    } else if (exerciseId === 'exercise2') {
        exerciseContent = 
            '<div class="space-y-4">' +
                '<div>' +
                    '<h4 class="font-semibold mb-2">Exercise 2: Model Training</h4>' +
                    '<p class="text-gray-600 mb-4">Build and train a classification model on a real dataset. Experiment with different algorithms and hyperparameters.</p>' +
                '</div>' +
                '<div>' +
                    '<h4 class="font-semibold mb-2">Instructions:</h4>' +
                    '<ol class="list-decimal list-inside text-gray-600 space-y-1">' +
                        '<li>Load the preprocessed dataset</li>' +
                        '<li>Split the data into training and testing sets</li>' +
                        '<li>Train at least three different classification models</li>' +
                        '<li>Evaluate each model using appropriate metrics</li>' +
                        '<li>Tune hyperparameters for the best performing model</li>' +
                    '</ol>' +
                '</div>' +
                '<div>' +
                    '<h4 class="font-semibold mb-2">Starter Code:</h4>' +
                    '<div class="bg-gray-100 p-3 rounded font-mono text-sm overflow-x-auto">' +
                        'import pandas as pd<br>' +
                        'from sklearn.model_selection import train_test_split, GridSearchCV<br>' +
                        'from sklearn.ensemble import RandomForestClassifier<br>' +
                        'from sklearn.linear_model import LogisticRegression<br>' +
                        'from sklearn.svm import SVC<br>' +
                        'from sklearn.metrics import accuracy_score, classification_report<br><br>' +
                        '# Load the preprocessed dataset<br>' +
                        'df = pd.read_csv("preprocessed_data.csv")<br><br>' +
                        '# Your code here...' +
                    '</div>' +
                '</div>' +
                '<div>' +
                    '<h4 class="font-semibold mb-2">Expected Output:</h4>' +
                    '<div class="bg-gray-100 p-3 rounded font-mono text-sm">' +
                        'Random Forest Accuracy: 0.92<br>' +
                        'Logistic Regression Accuracy: 0.85<br>' +
                        'SVM Accuracy: 0.89<br><br>' +
                        'Best model: Random Forest<br>' +
                        'Best parameters: {\'n_estimators\': 100, \'max_depth\': 10}<br>' +
                        'Best accuracy: 0.94' +
                    '</div>' +
                '</div>' +
            '</div>';
    }
    
    modal.innerHTML = 
        '<div class="modal-content bg-white rounded-lg p-8 max-w-4xl max-h-[80vh] overflow-y-auto">' +
            '<div class="flex justify-between items-center mb-4">' +
                '<h3 class="text-xl font-semibold">Interactive Exercise</h3>' +
                '<button onclick="this.parentElement.parentElement.parentElement.remove()" class="text-gray-500 hover:text-gray-700">' +
                    '<i class="fas fa-times text-xl"></i>' +
                '</button>' +
            '</div>' +
            exerciseContent +
            '<div class="mt-6 flex justify-between">' +
                '<button onclick="downloadResource(\'' + exerciseId + '_solution.ipynb\')" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">' +
                    '<i class="fas fa-download mr-2"></i>Download Solution' +
                '</button>' +
                '<button onclick="this.parentElement.parentElement.parentElement.remove()" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">' +
                    'Close' +
                '</button>' +
            '</div>' +
        '</div>';
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Quiz functions
function initQuiz() {
    renderQuestion();
}

function renderQuestion() {
    const question = quizQuestions[currentQuestion];
    document.getElementById('questionText').textContent = question.question;
    
    const answersContainer = document.getElementById('answersContainer');
    answersContainer.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
        const answerElement = document.createElement('div');
        answerElement.className = 'quiz-option p-3 border rounded-lg cursor-pointer hover:bg-purple-50 transition';
        answerElement.innerHTML = 
            '<label class="flex items-center">' +
                '<input type="radio" name="quizAnswer" value="' + index + '" class="mr-3">' +
                answer +
            '</label>';
        answerElement.addEventListener('click', () => selectAnswer(index));
        answersContainer.appendChild(answerElement);
    });
    
    document.getElementById('quizProgress').textContent = 'Question ' + (currentQuestion + 1) + ' of ' + quizQuestions.length;
    
    document.getElementById('prevBtn').classList.toggle('hidden', currentQuestion === 0);
    document.getElementById('nextBtn').textContent = currentQuestion === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question';
}

function selectAnswer(index) {
    quizAnswers[currentQuestion] = index;
    
    // Highlight selected answer
    document.querySelectorAll('.quiz-option').forEach((el, i) => {
        if (i === index) {
            el.classList.add('selected');
        } else {
            el.classList.remove('selected');
        }
    });
}

function nextQuestion() {
    if (currentQuestion < quizQuestions.length - 1) {
        currentQuestion++;
        renderQuestion();
    } else {
        finishQuiz();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
    }
}

function finishQuiz() {
    // Calculate score
    score = 0;
    quizAnswers.forEach((answer, index) => {
        if (answer === quizQuestions[index].correct) {
            score++;
        }
    });
    
    const percentage = Math.round((score / quizQuestions.length) * 100);
    
    // Show results
    document.getElementById('quizContainer').classList.add('hidden');
    document.getElementById('quizResults').classList.remove('hidden');
    document.getElementById('scoreDisplay').textContent = percentage + '%';
    
    // Show appropriate message
    let message = "";
    if (percentage >= 80) {
        message = "Excellent! You have a strong understanding of ML concepts.";
    } else if (percentage >= 60) {
        message = "Good job! You understand the basics, but review the material to improve.";
    } else {
        message = "Keep studying! Review the material and try the quiz again.";
    }
    document.getElementById('resultMessage').textContent = message;
    
    // Generate answer review
    const answerReview = document.getElementById('answerReview');
    answerReview.innerHTML = '<h4 class="font-semibold mb-2">Answer Review:</h4>';
    
    quizQuestions.forEach((question, index) => {
        const isCorrect = quizAnswers[index] === question.correct;
        const answerClass = isCorrect ? 'correct' : 'incorrect';
        const icon = isCorrect ? 'fa-check-circle text-green-500' : 'fa-times-circle text-red-500';
        
        answerReview.innerHTML += 
            '<div class="mb-3 p-3 rounded-lg ' + (isCorrect ? 'bg-green-50' : 'bg-red-50') + '">' +
                '<div class="flex items-start">' +
                    '<i class="fas ' + icon + ' mr-2 mt-1"></i>' +
                    '<div class="flex-grow">' +
                        '<p class="font-medium">Question ' + (index + 1) + ': ' + question.question + '</p>' +
                        '<p class="text-sm text-gray-600 mt-1">Your answer: ' + question.answers[quizAnswers[index]] + '</p>' +
                        '<p class="text-sm text-gray-600">Correct answer: ' + question.answers[question.correct] + '</p>' +
                        '<p class="text-sm text-gray-500 mt-1">' + question.explanation + '</p>' +
                    '</div>' +
                '</div>' +
            '</div>';
    });
    
    quizCompleted = true;
}

function restartQuiz() {
    currentQuestion = 0;
    quizAnswers = [];
    score = 0;
    quizCompleted = false;
    
    document.getElementById('quizResults').classList.add('hidden');
    document.getElementById('quizContainer').classList.remove('hidden');
    renderQuestion();
}

// Notification function
function showNotification(message) {
    const notification = document.getElementById('notificationToast');
    document.getElementById('notificationMessage').textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}