# Multi-site Analysis Page

The Multi-site Analysis Page shows the combined statistics of the commuting options from all Commuters contained in each Site that is part of the Multi-site Analysis.  This page is very similar to the [Site Page](site.md) but has a few differences.

## Summary

The `Summary` tab looks just like the `Summary` tab in the Site view.  In this case the statistics shown are calculated from all Commuters at all Sites.

## Sites

The `Sites` tab is an extra tab shown on the Multi-site Analysis Page.  This tab contains a table that shows all of the Sites with the following columns:

| Column | Description |
|---|---|
| Name | The name of the Site |
| Address | The address of the Site |
| # of Commuters | The number of Commuters at the Site |


## Commuters

The `Commuters` tab in the Multi-site Analysis Page has only a few differences from the same tab in the Site Page.  There are no buttons to add Commuters.  These buttons can only be accessed from the Site Page.  The table showing the Commuters no longer includes the Geocode Confidence or Tools columns, but instead shows the name of the Site that the Commuter belongs to.

## Analysis

On the Multi-site Analysis Page, the `Analysis` tab does not show the commute time visualizations on the map.  This is because travel times from each site to each commuter will not be the same.  However, the `Analysis` tab does show the Commuter Travel Time Summary table.  The statistics in the table are calculated using the travel times of each commuter to their own site.  The statistics are again specific to the currently selected transportation mode.

## Ridematches

On the Multi-site Analysis Page, the `Ridematches` tab has all of the same functionality of the same tab on the Site Page.  The only difference is that commuters from all Sites included in the Multi-site Analysis are used to make the visualizations and to calculate the data in the Ridematch Summary Table.

## Individual

On the Multi-site Analysis Page, the `Individual` tab has all of the same functionality of the same tab on the Site Page.  The only difference is that the details of any commuter from any of the Sites included in the Multi-site Analysis can be viewed.

## That's all!

Congratulations, you have finished the tutorial of Conveyal Commute!  We hope this tool is useful for you.  If you have any problems, questions or comments please see the [support](../support.md) page for instructions on how to contact us.
