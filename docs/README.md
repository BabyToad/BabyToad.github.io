# For Want of Fuel Documentation

This folder contains internal documentation for the For Want of Fuel project. These files are not published to the public site and are intended for development reference only.

## Folder Structure

```
docs/
├── README.md              # This file
├── features/             # Feature-specific documentation
│   └── tag_system.md     # Tag system implementation details
└── ...                   # Future documentation files
```

## Documentation Guidelines

1. All documentation should be written in Markdown
2. Use clear headings and subheadings
3. Include code examples where relevant
4. Keep implementation details separate from user documentation
5. Update documentation when making significant changes

## Adding New Documentation

1. Create a new markdown file in the appropriate subfolder
2. Follow the existing documentation format
3. Update this README if adding new sections or categories
4. Include links to related documentation files

## Note on Privacy

This documentation is for internal use only and should not be included in the Jekyll build. The `docs/` folder should be excluded in `_config.yml` to ensure these files are not published to the public site. 