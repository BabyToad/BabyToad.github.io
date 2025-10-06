---
layout: project
title: Workshop-Zuteilungs-Tool
description: A desktop application for optimal student-to-workshop assignment using mathematical optimization algorithms.
status: Complete
version: 1.0.0
confidence: High-ish
tags:
  - Python
  - Desktop Application
  - Educational Tools
  - Linear Programming
  - Optimization
  - tkinter
  - Excel Integration
last_modified_at: 2025-10-06
github_url: https://github.com/babytoad/clown_orga
show_repo: true
---

# Workshop-Zuteilungs-Tool

A desktop application for optimal student-to-workshop assignment using mathematical optimization algorithms. Built with Python and featuring a clean MVC architecture. Done for a overworked teacher.

## Download

Ready-to-use executable and example file:

<div class="project-cta">
  <a href="https://drive.google.com/file/d/1zuYqVlzOxiYqPUP7WMG1wuO45WzN6oOG/view?usp=sharing" class="project-cta-link" target="_blank">
    <i class="fab fa-google-drive"></i>
    Download from Google Drive (140MB)
  </a>
  <a href="/assets/downloads/example_students.xlsx" class="project-cta-link" download>
    <i class="fas fa-file-excel"></i>
    Download Example Excel File for Input
  </a>
</div>

**System Requirements:**
- Windows 10/11
- No additional software required (standalone executable)

## About the Project

The Workshop-Zuteilungs-Tool helps teachers automatically assign students to workshops over multiple days using a mathematical optimization algorithm (Linear Programming) to maximize overall satisfaction while respecting all constraints.

### Key Features

- **Excel Integration**: Import student data and export results
- **Mathematical Optimization**: Linear Programming algorithm for optimal assignments
- **Flexible Parameters**: Customizable optimization settings
- **MVC Architecture**: Clean, maintainable codebase with 86 unit tests
- **Modern UI**: Bootstrap-themed tkinter interface with 6 theme options
- **GDPR Compliant**: All data processing happens locally

## Technical Highlights

### Architecture

- **MVC Pattern**: Clean separation of concerns with Models, Views, and Controllers
- **Service Layer**: Business logic separated into dedicated services
- **Type Safety**: Full type hints and dataclasses throughout
- **Testability**: 86 unit tests with 100% model coverage
- **Dependency Injection**: Services injected as dependencies

### Optimization Algorithm

The core uses **Linear Programming (LP)** with the PuLP library:

- **Decision Variables**: Binary assignments for each student-workshop-day combination
- **Objective Function**: Maximize weighted satisfaction scores
- **Constraints**: 
  - One workshop per student per day
  - Workshop capacity limits
  - Optional class grouping requirements
- **Solver**: COIN-OR Branch and Cut (CBC) for guaranteed optimal solutions

### Performance

For typical school scenarios (100 students, 12 workshops, 3 days):
- **Variables**: ~3,600 binary variables
- **Constraints**: ~300 constraint equations  
- **Runtime**: Typically < 1 second
- **Solution Quality**: Mathematically optimal

## Usage Workflow

The application guides users through a 5-step wizard:

1. **Data Import**: Excel file with student preferences
2. **Parameters**: Days, capacity, class grouping, weights
3. **Review**: Feasibility analysis and warnings
4. **Optimization**: Automatic calculation with progress tracking
5. **Results**: Statistics, visualizations, and Excel export

## Excel Format

### Input Requirements

| Column | Description | Required |
|--------|-------------|----------|
| vorname | First name | Yes |
| nachname | Last name | Yes |
| klasse | Class | Yes |
| wunsch1-4 | Preferences 1-4 | Yes |

### Output Structure

The exported Excel contains three sheets:
- **Students**: Individual assignments by day
- **Workshops**: Participant lists by workshop
- **Statistics**: Detailed satisfaction metrics

## Technology Stack

- **Python 3.12** with type hints
- **tkinter** + **ttkbootstrap** for modern UI
- **pandas** + **openpyxl** for Excel processing
- **PuLP** for linear programming optimization
- **pytest** for comprehensive testing

## Development Features

### Code Quality

- **Type Safety**: Full type hints throughout
- **Documentation**: Google-style docstrings
- **Testing**: 86 unit tests with coverage reporting
- **Code Style**: PEP 8 compliant with 100-character line limit

### UI Components

Reusable components in `views/components/`:
- **Dropzone**: Drag & drop file selection
- **DataPreview**: Tabular data display
- **ProgressStepper**: Wizard progress indicator
- **InfoPanel**: Collapsible information panels
- **Tooltip**: Contextual help system

### Themes

Six Bootstrap themes available:
- `cosmo` (default): Light, modern
- `darkly`: Dark mode
- `flatly`: Clean & minimal
- `superhero`: Dark with color
- `litera`: High readability
- `cyborg`: Dark tech aesthetic

## Installation & Usage

```bash
# Setup virtual environment
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Run application
python app.py
```

## Testing

```bash
# Run all tests
pytest

# With coverage report
pytest --cov=. --cov-report=html

# Specific test suites
pytest tests/test_models.py
pytest tests/test_services.py
```

## Export as Executable

Create standalone .exe for distribution:

```bash
pip install pyinstaller
pyinstaller --onefile --windowed --name "Workshop-Tool" app.py
```

## Repository

The complete source code, documentation, and examples are available on GitHub:

[View on GitHub](https://github.com/babytoad/clown_orga)

## Current Status

- Complete MVC implementation
- Mathematical optimization engine
- Excel import/export functionality
- Modern UI with multiple themes
- Comprehensive testing suite
- Documentation and architecture guides
- Executable build system

### GDPR Compliance

All data processing happens locally on the user's machine. No cloud processing or data transmission occurs, ensuring full GDPR compliance for educational use.
