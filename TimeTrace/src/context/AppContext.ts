import React, { useState, createContext } from 'react';
import MappingsPage from '../pages/MappingsPage';

type AppData = {
    mappingsAreEditable: boolean;
    events: string[];
    mappings: Map<string, string>;
    fileLines: string[];
}

export const AppContext = createContext<AppData | null>(null);