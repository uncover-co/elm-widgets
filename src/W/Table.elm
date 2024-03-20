module W.Table exposing
    ( view
    , column, string, int, float, bool, Column
    , customLabel, alignRight, alignCenter, width, relativeWidth, largeScreenOnly, columnHtmlAttrs, ColumnAttribute
    , onClick, onMouseEnter, onMouseLeave
    , groupBy, groupValue, groupValueCustom, groupSortBy, groupCollapsed, groupLabel, onGroupClick, onGroupMouseEnter, onGroupMouseLeave
    , highlight
    , htmlAttrs, noAttr, Attribute
    )

{-|

@docs view


# Columns

@docs column, string, int, float, bool, Column


# Column Attributes

@docs customLabel, alignRight, alignCenter, width, relativeWidth, largeScreenOnly, columnHtmlAttrs, ColumnAttribute


# Actions

@docs onClick, onMouseEnter, onMouseLeave


# Groups

@docs groupBy, groupValue, groupValueCustom, groupSortBy, groupCollapsed, groupLabel, onGroupClick, onGroupMouseEnter, onGroupMouseLeave


# Table Attributes

@docs highlight


# Html

@docs htmlAttrs, noAttr, Attribute

-}

import Dict
import Html as H
import Html.Attributes as HA
import Html.Events as HE
import W.InputCheckbox
import W.Internal.Helpers as WH



-- Table Attributes


{-| -}
type Attribute msg a
    = Attribute (Attributes msg a -> Attributes msg a)


type alias Attributes msg a =
    { groupBy : Maybe (a -> String)
    , groupSortBy : List ( String, a, List a ) -> List ( String, a, List a )
    , groupCollapsed : Maybe (a -> String -> Bool)
    , highlight : a -> Bool
    , onClick : Maybe (a -> msg)
    , onMouseEnter : Maybe (a -> msg)
    , onMouseLeave : Maybe msg
    , onGroupClick : Maybe (a -> msg)
    , onGroupMouseEnter : Maybe (a -> msg)
    , onGroupMouseLeave : Maybe msg
    , htmlAttributes : List (H.Attribute msg)
    }


applyAttrs : List (Attribute msg a) -> Attributes msg a
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes msg a
defaultAttrs =
    { groupBy = Nothing
    , groupSortBy = identity
    , groupCollapsed = Nothing
    , highlight = \_ -> False
    , onClick = Nothing
    , onMouseEnter = Nothing
    , onMouseLeave = Nothing
    , onGroupClick = Nothing
    , onGroupMouseEnter = Nothing
    , onGroupMouseLeave = Nothing
    , htmlAttributes = []
    }


{-| -}
groupBy : (a -> String) -> Attribute msg a
groupBy v =
    Attribute (\attrs -> { attrs | groupBy = Just v })


{-| -}
groupSortBy : (a -> String -> comparable) -> Attribute msg a
groupSortBy fn =
    Attribute (\attrs -> { attrs | groupSortBy = List.sortBy (\( l, a, _ ) -> fn a l) })


{-| -}
groupCollapsed : (a -> String -> Bool) -> Attribute msg a
groupCollapsed fn =
    Attribute (\attrs -> { attrs | groupCollapsed = Just fn })


{-| -}
highlight : (a -> Bool) -> Attribute msg a
highlight v =
    Attribute (\attrs -> { attrs | highlight = v })


{-| -}
onClick : (a -> msg) -> Attribute msg a
onClick v =
    Attribute (\attrs -> { attrs | onClick = Just v })


{-| -}
onMouseEnter : (a -> msg) -> Attribute msg a
onMouseEnter v =
    Attribute (\attrs -> { attrs | onMouseEnter = Just v })


{-| -}
onMouseLeave : msg -> Attribute msg a
onMouseLeave v =
    Attribute (\attrs -> { attrs | onMouseLeave = Just v })


{-| -}
onGroupClick : (a -> msg) -> Attribute msg a
onGroupClick v =
    Attribute (\attrs -> { attrs | onGroupClick = Just v })


{-| -}
onGroupMouseEnter : (a -> msg) -> Attribute msg a
onGroupMouseEnter v =
    Attribute (\attrs -> { attrs | onGroupMouseEnter = Just v })


{-| -}
onGroupMouseLeave : msg -> Attribute msg a
onGroupMouseLeave v =
    Attribute (\attrs -> { attrs | onGroupMouseLeave = Just v })


{-| -}
htmlAttrs : List (H.Attribute msg) -> Attribute msg a
htmlAttrs v =
    Attribute <| \attrs -> { attrs | htmlAttributes = v }


{-| -}
noAttr : Attribute msg a
noAttr =
    Attribute identity



-- Column Attributes


{-| -}
type Column msg a
    = Column (ColumnAttributes msg a)


{-| -}
type ColumnAttribute msg a
    = ColumnAttribute (ColumnAttributes msg a -> ColumnAttributes msg a)


type alias ColumnAttributes msg a =
    { label : String
    , customLabel : Maybe (H.Html msg)
    , alignment : H.Attribute msg
    , width : H.Attribute msg
    , largeScreenOnly : Bool
    , toHtml : a -> H.Html msg
    , toGroup : Maybe (String -> a -> List a -> H.Html msg)
    , htmlAttributes : List (H.Attribute msg)
    }


column_ : ColumnAttributes msg a -> List (ColumnAttribute msg a) -> Column msg a
column_ default attrs =
    Column (List.foldl (\(ColumnAttribute fn) a -> fn a) default attrs)


columnAttrs : String -> (a -> H.Html msg) -> ColumnAttributes msg a
columnAttrs label toHtml =
    { label = label
    , customLabel = Nothing
    , alignment = HA.class "ew-text-left"
    , width = HA.class ""
    , largeScreenOnly = False
    , toHtml = toHtml
    , toGroup = Nothing
    , htmlAttributes = []
    }


columnStyles : ColumnAttributes msg a -> List (H.Attribute msg)
columnStyles attrs =
    [ attrs.alignment
    , attrs.width
    , HA.classList
        [ ( "ew-hidden lg:ew-table-cell", attrs.largeScreenOnly ) ]
    ]


{-| -}
columnHtmlAttrs : List (H.Attribute msg) -> ColumnAttribute msg a
columnHtmlAttrs v =
    ColumnAttribute (\attrs -> { attrs | htmlAttributes = v })


{-| -}
customLabel : H.Html msg -> ColumnAttribute msg a
customLabel value =
    ColumnAttribute (\attrs -> { attrs | customLabel = Just value })


{-| -}
alignRight : ColumnAttribute msg a
alignRight =
    ColumnAttribute (\attrs -> { attrs | alignment = HA.class "ew-text-right" })


{-| -}
alignCenter : ColumnAttribute msg a
alignCenter =
    ColumnAttribute (\attrs -> { attrs | alignment = HA.class "ew-text-center" })


{-| -}
width : Int -> ColumnAttribute msg a
width v =
    ColumnAttribute (\attrs -> { attrs | width = HA.style "width" (pxString v) })


{-| -}
relativeWidth : Float -> ColumnAttribute msg a
relativeWidth v =
    ColumnAttribute (\attrs -> { attrs | width = HA.style "width" (WH.formatPct v) })


{-| -}
largeScreenOnly : ColumnAttribute msg a
largeScreenOnly =
    ColumnAttribute (\attrs -> { attrs | largeScreenOnly = True })


{-| -}
groupValue : (String -> List a -> H.Html msg) -> ColumnAttribute msg a
groupValue fn =
    ColumnAttribute (\attrs -> { attrs | toGroup = Just (\x _ xs -> fn x xs) })


{-| -}
groupValueCustom : (a -> List a -> H.Html msg) -> ColumnAttribute msg a
groupValueCustom fn =
    ColumnAttribute (\attrs -> { attrs | toGroup = Just (\_ x xs -> fn x xs) })


{-| -}
groupLabel : ColumnAttribute msg a
groupLabel =
    ColumnAttribute (\attrs -> { attrs | toGroup = Just (\label _ _ -> H.text label) })



-- View


{-| -}
view : List (Attribute msg a) -> List (Column msg a) -> List a -> H.Html msg
view attrs_ columns data =
    let
        attrs : Attributes msg a
        attrs =
            applyAttrs attrs_

        rows : List (H.Html msg)
        rows =
            case attrs.groupBy of
                Just groupBy_ ->
                    data
                        |> toGroupedRows attrs groupBy_
                        |> List.concatMap
                            (\( groupLabel_, groupItem, groupItems ) ->
                                let
                                    groupRows : List a
                                    groupRows =
                                        attrs.groupCollapsed
                                            |> Maybe.map (\fn -> fn groupItem groupLabel_)
                                            |> Maybe.withDefault False
                                            |> WH.or [] groupItems
                                in
                                viewGroupHeader attrs columns groupLabel_ groupItem groupItems
                                    :: List.map (viewTableRow attrs columns) groupRows
                            )

                Nothing ->
                    List.map (viewTableRow attrs columns) data
    in
    H.table
        (attrs.htmlAttributes
            ++ [ HA.class "ew-table ew-table-fixed ew-indent-0"
               , HA.class "ew-w-full ew-overflow-auto"
               , HA.class "ew-bg-base-bg ew-font-text ew-text-base-fg"
               ]
        )
        [ -- Table Head
          H.thead
            [ HA.class "ew-sticky ew-z-20 ew-top-0 ew-z-10"
            , HA.class "ew-bg-base-bg"
            ]
            [ H.tr [] (List.map viewTableHeaderColumn columns) ]
        , --  Table Body
          H.tbody
            [ WH.maybeAttr HE.onMouseLeave attrs.onMouseLeave ]
            rows
        ]


toGroupedRows : Attributes msg a -> (a -> String) -> List a -> List ( String, a, List a )
toGroupedRows attrs groupBy_ data =
    data
        |> List.foldl
            (\row acc ->
                let
                    key : String
                    key =
                        groupBy_ row
                in
                Dict.update key
                    (\items ->
                        case items of
                            Just ( a, items_ ) ->
                                Just ( a, items_ ++ [ row ] )

                            Nothing ->
                                Just ( row, [ row ] )
                    )
                    acc
            )
            Dict.empty
        |> Dict.toList
        |> List.map (\( label, ( a, items ) ) -> ( label, a, items ))
        |> attrs.groupSortBy


viewGroupHeader : Attributes msg a -> List (Column msg a) -> String -> a -> List a -> H.Html msg
viewGroupHeader attrs columns groupLabel_ groupItem groupColumns =
    H.tr
        [ HA.class "ew-table-group-header"
        , HA.class "ew-p-0 ew-font-semibold ew-bg-base-aux/[0.07]"
        , WH.maybeAttr (\fn -> HE.onClick (fn groupItem)) attrs.onGroupClick
        , WH.maybeAttr (\fn -> HE.onMouseEnter (fn groupItem)) attrs.onGroupMouseEnter
        , WH.maybeAttr HE.onMouseEnter attrs.onGroupMouseLeave
        , HA.classList
            [ ( "hover:ew-bg-base-aux/10 active:ew-bg-base-aux/[0.07]", attrs.onGroupClick /= Nothing )
            ]
        ]
        (columns
            |> List.map
                (\(Column col) ->
                    H.td
                        (columnStyles col
                            ++ col.htmlAttributes
                            ++ [ HA.class "ew-shrink-0 ew-m-0 ew-break-words" ]
                        )
                        [ col.toGroup
                            |> Maybe.map (\fn -> fn groupLabel_ groupItem groupColumns)
                            |> Maybe.withDefault (H.text "")
                        ]
                )
        )


viewTableHeaderColumn : Column msg a -> H.Html msg
viewTableHeaderColumn (Column col) =
    H.th
        (columnStyles col
            ++ [ HA.class "ew-m-0 ew-font-semibold ew-text-sm ew-text-base-aux" ]
        )
        (case col.customLabel of
            Just custom ->
                [ custom ]

            Nothing ->
                [ H.text col.label ]
        )


viewTableRow : Attributes msg a -> List (Column msg a) -> a -> H.Html msg
viewTableRow attrs columns datum =
    H.tr
        [ HA.class "ew-p-0"
        , if attrs.highlight datum then
            HA.classList
                [ ( "ew-bg-base-aux/10", True )
                , ( "hover:ew-bg-base-aux/[0.07] active:ew-bg-base-aux/10", attrs.onClick /= Nothing )
                ]

          else
            HA.classList
                [ ( "hover:ew-bg-base-aux/[0.04] active:ew-bg-base-aux/[0.07]", attrs.onClick /= Nothing )
                ]
        , WH.maybeAttr (\onClick_ -> HE.onClick (onClick_ datum)) attrs.onClick
        , WH.maybeAttr (\onMouseEnter_ -> HE.onMouseEnter (onMouseEnter_ datum)) attrs.onMouseEnter
        ]
        (columns
            |> List.map
                (\(Column col) ->
                    H.td
                        (columnStyles col
                            ++ col.htmlAttributes
                            ++ [ HA.class "ew-shrink-0 ew-m-0 ew-break-words" ]
                        )
                        [ col.toHtml datum ]
                )
        )



-- Column Builders


{-| -}
column :
    List (ColumnAttribute msg a)
    ->
        { label : String
        , content : a -> H.Html msg
        }
    -> Column msg a
column attrs_ props =
    column_
        (columnAttrs props.label props.content)
        attrs_


{-| -}
string :
    List (ColumnAttribute msg a)
    -> { label : String, value : a -> String }
    -> Column msg a
string attrs_ props =
    column_
        (columnAttrs props.label (\a -> H.text (props.value a)))
        attrs_


{-| -}
int :
    List (ColumnAttribute msg a)
    -> { label : String, value : a -> Int }
    -> Column msg a
int attrs_ props =
    let
        default : ColumnAttributes msg a
        default =
            columnAttrs props.label (\a -> H.text (String.fromInt (props.value a)))
    in
    column_ { default | alignment = HA.class "ew-text-right" } attrs_


{-| -}
float :
    List (ColumnAttribute msg a)
    -> { label : String, value : a -> Float }
    -> Column msg a
float attrs_ props =
    let
        default : ColumnAttributes msg a
        default =
            columnAttrs props.label (\a -> H.text (String.fromFloat (props.value a)))
    in
    column_ { default | alignment = HA.class "ew-text-right" } attrs_


{-| -}
bool :
    List (ColumnAttribute msg a)
    -> { label : String, value : a -> Bool }
    -> Column msg a
bool attrs_ props =
    let
        default : ColumnAttributes msg a
        default =
            columnAttrs props.label (\a -> W.InputCheckbox.viewReadOnly [] (props.value a))
    in
    column_ { default | alignment = HA.class "ew-text-right" } attrs_



-- Helpers


pxString : Int -> String
pxString v =
    String.fromInt v ++ "px"
