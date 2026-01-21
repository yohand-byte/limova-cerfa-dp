# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-21

### Added
- 🎉 Initial release
- ✅ CERFA 16702-01 generator with automatic form filling
- ✅ Cadastre API integration for automatic parcel lookup
- ✅ Google Maps Geocoding API integration
- ✅ Support for interactive PDF forms
- ✅ Fallback to coordinate-based filling for non-interactive PDFs
- ✅ Electronic signature support (PNG format)
- ✅ Automatic annexes generation (DP1-DP8)
  - DP1: Situation plan (IGN map)
  - DP5-DP8: Street View photos (4 angles)
- ✅ Multi-installer support (variable company data)
- ✅ Complete documentation (README, USAGE, INTEGRATION)
- ✅ Usage examples (basic and with signature)

### Features
- Automatic address geocoding
- Cadastral parcel identification (prefix, section, number, area)
- PDF form field mapping
- Signature embedding
- High-resolution Street View photos
- Error handling and logging

### APIs Used
- Google Maps Geocoding API
- Google Street View Static API
- API Cadastre (IGN)
- IGN Géoportail WMS

### Dependencies
- pdf-lib: ^1.17.1
- node-fetch: ^2.6.7
- sharp: ^0.32.0
