## data-viz-project

https://atobywankenobi.github.io/data-viz-project/

## Changelog

TODO

	Filter data by source and event type/CAMEO code
		find suitable data structure
		add the "selection box" component

	Time Slider
		dragging back should remove events
        dragging & *clicking* forward should add *all* events
        the new scale seems bugged - check scale

	Improvements/visuals/misc
		add slidebar tooltip to show date where mouse is hovering
		keep an event counter somewhere (by category, etc)

	Interactive visualization :
		select-to-zoom on the time series will show the area of attention of the outlet

	Source statistics in right panel
		After selecting 1-5 outlets, show a time-serie of their number of publications

	Time Slider
		(?) Allows user to select start time for the animation

	visual improvements
		"fixed" layout without scroll on the page & see all at once
			no need for the header bar
			larger sources placeholder
		add day/night overlay
		points should not scale with zoom


	misc
		style slide bar and "clock" div
		add slidebar tooltip to show date where mouse is hovering
		keep an event/mention counter somewhere (by category, etc)
		faster/slower buttons beside play, to speed up timeline
		add small random offset to events locations so that they don't "stack"
		verticakl "looped scroll" on the

    UX / user interaction / user interface
        time slider should offer start slider / stop slider / reset button
        speed selection button
        !!! DOTS SHOULD SCALE BETTER

    Styling
        Do a nice time slider
        Do a nice clock in a corner somewhere
        add random offset to events location so that they stack less
        [?] add random time offset to events so that they pop continuously


IN PROGRESS

	Layout
        Proportional, 2-panel resizable layout
            SVG map should maximize into the available space while retaining aspect ratio
            # SVG map should scale with panel redimensioning
            # SVG map should not scale with panel redimensioning once zoomed in
            Settings menu, tabbed, collapsable

DONE

	wireframes & prototypes drawings
		Idea : Show a world map
		Idea : Events pop up on the map (as dots, or heatmap) as time passes
		Idea : (Selected) News outlets are shows as icons / markers, located
			on the map at the "mean position" of events they report (which
			moves as time passes)
		Idea : tooltip with some events info when hovering on events
		Idea : Clicking on an outlet's marker shows its "Region of focus"

	Acquire sample dataset
		preprocess, remove unnecessary features

	Display world map
		draw countries outline & fill with d3

	responsive website template with bootstrap.js

	acquire full 1-week dataset
		download cumulative, 15m updates
		reduce size : filter out unnecessary features

	improved / more precise prototype
		components
			world map
		  	sime slider / play button / timeframe selection
		  	right box containing data series showing activity of outlets
		  	bottom box for outlets, event type selection
		Sources representation
			Forget about moving markers
			Select a few sources, show their activity as a time-serie on the side
		Interaction : selecting a part of a time-serie shows the "region of focus" of the source on the map
		events are dots
		dot events grow smaller / change color to indicate age

	map pan / zoom

	Time slider
		Play button starts the animation
		Triggers the load of new data files & matching animation

	events tooltips with basic infos

	Time Slider
		dragging back should remove events

	Filter data by source and event type/CAMEO code
		find suitable data structure
		add the "selection box" component


	events tooltips with basic infos
