# Site Page (with commuters!)

Awesome, you've created a site and uploaded some commuters.  The Site page will now automatically update you on the status of the calculations of all the commuters' commutes.  Let's take a look at what analyses we have available.

## Summary Tab

The `Summary` tab will show some meaningful statistics about mode-shift opportunities at this site.  This view is currently under construction and will be updated in a later release of Conveyal Commute.

## Commuters Tab

<img src="../../img/site-commuters.png" class="img-spotlight"/>

The `Commuters` tab has various tools and information to handle the commuters at a site.  There are buttons to add more commuters to the site.  In the top right corner is a table showing how many of the commuters have been geocoded and how many of them have had their commutes calculated.  Below that is a table that will show all of the commuters with the following columns:

| Column | Description |
|---|---|
| Name | The name of the commuter |
| Address | The address of the commuter |
| Geocode Confidence | The level of accuracy of the geocoding result for this commuter.  **Conveyal may remove this column as it has been primarily been used as a testing tool.** |
| Tools | Buttons for editing or deleting the commuter |

## Analysis Tab

The `Analysis` tab provides detailed visualization of commuter travel times on the map and also a table of summary statistics.  There are 3 selectors that allow you to customize the visualization and summary table.  

The `Mode` selector allows you to choose which mode of transportation to analyze.  Unfortunately for now, the `Car` mode does not include travel times with traffic.  

The `Map Style` selector allows you to choose from various options of styling the map.  Each option is a different style of an Isochrone.  An Isochrone is a geographic visualization of travel from an origin.  In Conveyal Commute the Isochrones show this visualization based on travel time.  Listed in the following sections are descriptions of each Isochrone style available.

The `Maximum Travel Time` selector is a slider which allows you to set how long of a travel time to show in the map display.  For the latter 3 map styles, it may take a brief moment to calculate and render the visualization at the current travel time setting.

### Map Style: Single Color Isochrone

<img src="../../img/isochrone-single-color.png" />

This visualization of isochrone shows the extent of area that is accessible within the currently selected maximum travel time.

### Map Style: Inverted Isochrone

<img src="../../img/isochrone-inverted.png" />

This visualization of isochrone is the reverse of the previous isochrone.  It shades areas that are NOT accessible within the selected maximum travel time.  Areas that are unshaded on the map represent areas that are accessible within the selected maximum travel time.

### Map Style: Blueish Isochrone (15 minute intervals)

<img src="../../img/isochrone-blueish-15.png" />

This visualization of isochrone shows multiple different travel times distinguished by different shades of color.  There are also solid black borders delineating each range of travel time.  The darker colors of blue show lower travel times and the lighter shaded colors show longer travel times.

### Map Style: Blueish Isochrone (5 minute intervals)

<img src="../../img/isochrone-blueish-5.png" />

Similar to the previous visualization, this isochrone shows multiple different travel times in various shades of blue.  Travel time intervals of 5-minutes are used and no border between each travel time range is shown.  This produces a smoother color transition.

### Map Style: Green > Yellow > Orange > Red Isochrone (5 minute intervals)

<img src="../../img/isochrone-green-red.png" />

The final isochrone visualization options also shades by color but this time in multiple colors.  The locations with lower travel times begin to get colored with green and transition to yellow, orange and red as the travel time increases.  Use caution with this display as it may not be observable by people who are unable to see all colors.

### Commuter Travel Time Summary

Below the selectors in the `Analysis` tab is a table with aggregate statistics of the commuting times of all commuters at the site.  The table shows how many commuters have a travel time lower than the time listed in the current row.  The data in the table is specific to the currently selected transportation mode.

## Ridematches Tab

The `Ridematches` tab provides detailed visualization of ridematching opportunities on the map and also a table of summary statistics.  There are 4 visualization options and a summary table.

### Map Style: Normal

<img src="../../img/ridematch-normal.png" />

The `Normal` map style shows the visualization of commuters represented as home icons.

### Map Style: Clusters

<img src="../../img/ridematch-cluster.png" />

The `Clusters` map style is a visualization that will aggregate commuters located close to each other into circle markers that display the number of commuters concentrated in a particular area.  When you hover over the marker with the mouse, these circle markers will display a polygon on the map marking the approximate extent of the commuters in that area.  If you click on the circle marker, the map will zoom in to reveal a more detailed look at where the commuters are located.  Zooming out will cause the more commuters and sometimes other circle markers to become aggregated together.

### Map Style: Heatmap

<img src="../../img/ridematch-heatmap.png" />

The `Heatmap` map style is a more abstract style that shows colors highlighting how concentrated commuters are in a particular area.  Higher concentrations of commuters are shown in an increasing scale starting with blue and then transitioning to green, yellow, orange and finally red for the highest concentration.

### Map Style: Commuter Rings

<img src="../../img/ridematch-rings.png" />

The `Commuter Rings` map style shows a circle of a customizable distance around each commuter.  When this visualization is selected an additional slider will appear below the Map Style selector allowing the selection of a custom size of circle to be drawn around each commuter.

### Ridematch Summary Table

Below the selectors in the `Ridematch` tab is a table with aggregate statistics of the ridematch opportunities of all commuters at the site.  The table shows how many commuters have at least one other commuter located within the distance listed in the current row.

## Individual Tab

The `Individual` tab displays information about a specific commuter.  A commuter can be selected from a combobox within this tab or by clicking on a commuter on the map.  There are 3 main sections of information about each commuter.

In the `Location` section, information on the address of the commuter is shown.  The `Commuting Options` section displays the travel times of each mode of transportation possible.  And the `Ridematches` section displays a sortable list of commuters within 5 miles of the current commuter.

## Next up...

Now that we've seen all that we can do with a site, let's wrap up this tutorial by creating a Multi-site Analysis.  You'll have to browse back to the home page to find the button to create a new Multi-site Analysis.
