package com.examly.springapp.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.examly.springapp.model.Place;
import com.examly.springapp.repository.PlaceRepository;


@Service
public class PlaceService {
    
    @Autowired
    PlaceRepository placeRepository;

    public Boolean addPlaces(Place place)
    {   
        List<Place> al=placeRepository.findAll();
        for(Place p:al)
        {
            if(p.getName().equals(place.getName()))
            { 
                return false;
            }
        } 
        placeRepository.save(place);
            return true;
        
        
    }

    public List<Place> getAllPlaces()
    {
        return placeRepository.findAll();
    }

    public Optional<Place> getPlaceById(int placeId)
    {
        if(placeRepository.existsById(placeId))
        {
            return placeRepository.findById(placeId);
        }
        return null;
    }
    public Place updatePlace(int placeId,Place pla)
    {
        
        Optional<Place> pl=placeRepository.findById(placeId);
        if(pl.isPresent())
        {
          Place place=pl.get();
          place.setName(pla.getName());
          place.setCategory(pla.getCategory());
          place.setLocation(pla.getLocation());
          place.setBestTimeToVisit(pla.getBestTimeToVisit());
          place.setPlaceImage(pla.getPlaceImage());
          return placeRepository.save(place);
        }
        return null;
    }
    public Boolean deletePlaceById(int placeId)
    {
        if(placeRepository.existsById(placeId))
        {
            placeRepository.deleteById(placeId);
            return true;
        }
        else
        {
            return null;
        }
    }
}
