# Introduction

## Conceptual Overview

Conveyal Commute facilitates quick and meaningful analysis into the commuting possibilities at a particular worksite.  The website allows users to analyze worksites and the possible commutes of all workers at that worksite.  Worksites can also be aggregated to view combined statistics among multiple sites in a particular area.

## Commute Concepts

### Sites

Sites are short for worksite.  They represent a single geographic location of an employer worksite.  A site has a name and an address.  A site contains a collection of commuters.  Once commuters are uploaded it is possible to view ridematches among commuters at the site.

#### Site Analyses

Once a site is saved, a calculation is performed to determine the travel time to all points in the region surrounding the site.  The travel times are calculated for the following modes of transportation: Transit, Bicycling, Walking and Driving.

#### Ridematches

A calculation of how far away each commuter is from other commuters is completed.  If a commuter is within 5 miles of another commuter they are considered to be candidates for ridematching.  The distance is calculated as the crow flys, so it does not take into account barriers like rivers or other driving impediments.

### Commuters

Commuters represent employees that commute to a specific site.  Commuters have a name and an address.  Although commuters can still be used with fuzzier locations such as zip codes, more precise locations will produce more accurate results.

### Multi-site Analyses

Multi-site Analyses include a collection of sites and thus the sites' respective commuters.  Multi-site Analyses can be used to calculate aggregate metrics comprised of the data from each site.  All of the metrics of individual sites are available in mutli-site analyses.  Multi-site analyses also facilitate ridematching among the commuters of different worksites.

## Let's get started!

Now that you know the basic concepts of Conveyal Commute, let's [get started](tutorial/home-page.md) with creating some sites!
