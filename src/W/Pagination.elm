module W.Pagination exposing (view)

import ElmBook.Actions exposing (logActionWith)
import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import Html as H
import Html.Attributes as HA
import Html.Events as HE
import W.Internal.Pagination


view :
    { total : Int
    , active : Int
    , onClick : Int -> msg
    }
    -> H.Html msg
view props =
    case W.Internal.Pagination.toPages props.active props.total of
        Ok pages ->
            H.div
                [ HA.class "ew-flex ew-font-primary ew-space-x-2 ew-text-base-aux" ]
                (List.map (viewPage props.active props.onClick) pages)

        Err errorMessage ->
            H.text errorMessage


viewPage : Int -> (Int -> msg) -> Int -> H.Html msg
viewPage active onClick page =
    H.p
        [ HE.onClick (onClick page)
        , HA.classList [ ( "ew-text-base-fg", page == active ) ]
        ]
        [ if page /= -1 then
            page
                |> String.fromInt
                |> H.text

          else
            H.text "—"
        ]
