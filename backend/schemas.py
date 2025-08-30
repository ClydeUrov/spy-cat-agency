from pydantic import BaseModel, validator
from typing import List, Optional
from datetime import datetime

# Spy Cat Schemas
class SpyCatBase(BaseModel):
    name: str
    years_of_experience: int
    breed: str
    salary: float

class SpyCatCreate(SpyCatBase):
    pass

class SpyCatUpdate(BaseModel):
    salary: float

class SpyCat(SpyCatBase):
    id: int
    
    class Config:
        from_attributes = True
        orm_mode = True

# Target Schemas
class TargetBase(BaseModel):
    name: str
    country: str
    notes: Optional[str] = ""

class TargetCreate(TargetBase):
    pass

class TargetUpdate(BaseModel):
    notes: Optional[str] = None
    complete: Optional[bool] = None

class Target(TargetBase):
    id: int
    complete: bool
    mission_id: int
    
    class Config:
        from_attributes = True
        orm_mode = True

# Mission Schemas
class MissionBase(BaseModel):
    targets: List[TargetCreate]
    
    @validator('targets')
    def validate_targets_count(cls, v):
        if len(v) < 1 or len(v) > 3:
            raise ValueError('Mission must have between 1 and 3 targets')
        return v

class MissionCreate(MissionBase):
    pass

class MissionAssign(BaseModel):
    cat_id: int

class Mission(BaseModel):
    id: int
    cat_id: Optional[int]
    complete: bool
    created_at: datetime
    targets: List[Target]
    cat: Optional[SpyCat]
    
    class Config:
        from_attributes = True
        orm_mode = True
