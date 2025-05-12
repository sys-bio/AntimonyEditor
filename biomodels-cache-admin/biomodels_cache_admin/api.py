"""
API interface for interacting with the BioModels database.
"""
import requests
from typing import List, Dict, Any, Callable, Optional

class BioModelsAPI:
    """Client for interacting with the BioModels REST API."""
    
    BASE_URL = "https://www.ebi.ac.uk/biomodels"
    
    def __init__(self):
        self.session = requests.Session()
    
    def get_models(self, progress_callback: Optional[Callable[[int, int], None]] = None) -> List[Dict[str, Any]]:
        """
        Retrieve all models from BioModels.
        
        Args:
            progress_callback: Optional callback function to track progress
            
        Returns:
            List of model metadata dictionaries
        """
        response = self.session.get(f"{self.BASE_URL}/api/v1/models")
        response.raise_for_status()
        data = response.json()
        
        models = data.get("models", [])
        total = data.get("total", 0)
        
        if progress_callback:
            progress_callback(len(models), total)
            
        return models
    
    def get_model(self, model_id: str) -> Dict[str, Any]:
        """
        Retrieve detailed information about a specific model.
        
        Args:
            model_id: Model ID (can be numeric or full ID)
            
        Returns:
            Model metadata dictionary
        """
        # Convert numeric ID to full ID if needed
        if model_id.isdigit():
            model_id = f"BIOMD{model_id.zfill(10)}"
            
        # Get model metadata
        response = self.session.get(f"{self.BASE_URL}/api/v1/models/{model_id}")
        response.raise_for_status()
        model_data = response.json()
        
        # Get model files
        response = self.session.get(f"{self.BASE_URL}/api/v1/models/{model_id}/files")
        response.raise_for_status()
        files_data = response.json()
        
        model_data["files"] = files_data
        return model_data 