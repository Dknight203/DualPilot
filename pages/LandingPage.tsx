import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { PRICING_PLANS } from '../constants';
import { Plan } from '../types';
import ScanForm from '../components/scan/ScanForm';
import ScoreGauge from '../components/common/ScoreGauge';
import PlanCards from '../components/pricing/PlanCards';
import Card from '../components/common/Card';

// SVG Icons
const ConnectIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757