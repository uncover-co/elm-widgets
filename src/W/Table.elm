module W.Table exposing (view)


import Html as H
import Html.Attributes as HA



type alias Attributes msg a =
	{ onClick : Maybe (a -> msg)
	, groupByList : List (a -> comparable)
	}

type alias TableColumn a =
	{ toString : a -> String
	}


view : List (TableColumn a) -> List a -> H.Html msg
view columns data =
	


W.Table.view
	[]
	[ W.Table.string .name []
	, W.Table.int .age []
	, W.Table.float .accuracy []
	, W.Table.bool .active
	, W.Table.html .starts [] UI.Stars.view 
	]
	data

W.Table.view
	[ W.Table.string .name []
	, W.Table.int .age [ W.Table.intAverage ]
	, W.Table.float .accuracy [ W.Table.groupLabel ]
	, W.Table.bool .active
	, W.Table.html .starts [] UI.Stars.view 
	]
	data








