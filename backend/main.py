from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import httpx

from database import get_db, SpyCat as SpyCatModel, Mission as MissionModel, Target as TargetModel
from schemas import (
    SpyCat, SpyCatCreate, SpyCatUpdate,
    Mission, MissionCreate, MissionAssign,
    Target, TargetUpdate
)

app = FastAPI(title="Spy Cat Agency API", version="1.0.0")

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cat breed validation using TheCatAPI
async def validate_cat_breed(breed: str) -> bool:
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get("https://api.thecatapi.com/v1/breeds")
            breeds = response.json()
            valid_breeds = [b["name"].lower() for b in breeds]
            return breed.lower() in valid_breeds
        except:
            return False

# Spy Cats Endpoints
@app.post("/cats/", response_model=SpyCat, status_code=status.HTTP_201_CREATED)
async def create_spy_cat(cat: SpyCatCreate, db: Session = Depends(get_db)):
    # Validate breed
    if not await validate_cat_breed(cat.breed):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid cat breed. Please use a valid breed from TheCatAPI."
        )
    
    db_cat = SpyCatModel(**cat.dict())
    db.add(db_cat)
    db.commit()
    db.refresh(db_cat)
    return db_cat

@app.get("/cats/", response_model=List[SpyCat])
def get_cats(db: Session = Depends(get_db)):
    cats = db.query(SpyCatModel).all()
    if not cats:
        raise HTTPException(status_code=404, detail="Cats not found")
    
    # Обрабатываем каждый объект, если это SQLAlchemy объект
    return [SpyCat.from_orm(cat) for cat in cats]

@app.get("/cats/{cat_id}", response_model=SpyCat)
def get_spy_cat(cat_id: int, db: Session = Depends(get_db)):
    cat = db.query(SpyCatModel).filter(SpyCatModel.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Spy cat not found")
    return cat

@app.put("/cats/{cat_id}", response_model=SpyCat)
def update_spy_cat(cat_id: int, cat_update: SpyCatUpdate, db: Session = Depends(get_db)):
    cat = db.query(SpyCatModel).filter(SpyCatModel.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Spy cat not found")
    
    cat.salary = cat_update.salary
    db.commit()
    db.refresh(cat)
    return cat

@app.delete("/cats/{cat_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_spy_cat(cat_id: int, db: Session = Depends(get_db)):
    cat = db.query(SpyCatModel).filter(SpyCatModel.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Spy cat not found")
    
    # Check if cat has active missions
    active_missions = db.query(MissionModel).filter(
        MissionModel.cat_id == cat_id,
        MissionModel.complete == False
    ).first()
    
    if active_missions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete cat with active missions"
        )
    
    db.delete(cat)
    db.commit()

# Mission Endpoints
@app.post("/missions/", response_model=Mission, status_code=status.HTTP_201_CREATED)
def create_mission(mission: MissionCreate, db: Session = Depends(get_db)):
    db_mission = MissionModel()
    db.add(db_mission)
    db.commit()
    db.refresh(db_mission)
    
    # Create targets
    for target_data in mission.targets:
        db_target = TargetModel(**target_data.dict(), mission_id=db_mission.id)
        db.add(db_target)
    
    db.commit()
    db.refresh(db_mission)
    return db_mission

@app.get("/missions/", response_model=List[Mission])
def get_missions(db: Session = Depends(get_db)):
    return db.query(MissionModel).all()

@app.get("/missions/{mission_id}", response_model=Mission)
def get_mission(mission_id: int, db: Session = Depends(get_db)):
    mission = db.query(MissionModel).filter(MissionModel.id == mission_id).first()
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    return mission

@app.put("/missions/{mission_id}/assign", response_model=Mission)
def assign_mission(mission_id: int, assignment: MissionAssign, db: Session = Depends(get_db)):
    mission = db.query(MissionModel).filter(MissionModel.id == mission_id).first()
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    
    # Check if cat exists and is available
    cat = db.query(SpyCatModel).filter(SpyCatModel.id == assignment.cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Spy cat not found")
    
    # Check if cat already has an active mission
    active_mission = db.query(MissionModel).filter(
        MissionModel.cat_id == assignment.cat_id,
        MissionModel.complete == False
    ).first()
    
    if active_mission:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cat already has an active mission"
        )
    
    mission.cat_id = assignment.cat_id
    db.commit()
    db.refresh(mission)
    return mission

@app.delete("/missions/{mission_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_mission(mission_id: int, db: Session = Depends(get_db)):
    mission = db.query(MissionModel).filter(MissionModel.id == mission_id).first()
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    
    if mission.cat_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete mission that is assigned to a cat"
        )
    
    db.delete(mission)
    db.commit()

# Target Endpoints
@app.put("/targets/{target_id}", response_model=Target)
def update_target(target_id: int, target_update: TargetUpdate, db: Session = Depends(get_db)):
    target = db.query(TargetModel).filter(TargetModel.id == target_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")
    
    mission = db.query(MissionModel).filter(MissionModel.id == target.mission_id).first()
    
    # Check if target or mission is complete
    if target.complete or mission.complete:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot update completed target or target in completed mission"
        )
    
    # Update fields
    if target_update.notes is not None:
        target.notes = target_update.notes
    if target_update.complete is not None:
        target.complete = target_update.complete
        
        # Check if all targets are complete to mark mission as complete
        if target_update.complete:
            all_targets_complete = all(
                t.complete for t in mission.targets
            )
            if all_targets_complete:
                mission.complete = True
    
    db.commit()
    db.refresh(target)
    return target

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
