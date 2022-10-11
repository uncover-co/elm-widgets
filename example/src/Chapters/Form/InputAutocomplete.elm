module Chapters.Form.InputAutocomplete exposing (chapter_)

import ElmBook.Actions exposing (logActionWithString)
import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import W.InputAutocomplete


result : String -> Maybe Int -> String
result search value =
    "\""
        ++ search
        ++ "\""
        ++ " "
        ++ (case value of
                Just int_ ->
                    "Just " ++ String.fromInt int_

                Nothing ->
                    "Nothing"
           )


chapter_ : Chapter x
chapter_ =
    chapter "Input Autocomplete"
        |> renderComponentList
            [ ( "Default"
              , W.InputAutocomplete.view [ W.InputAutocomplete.placeholder "Search for a number…" ]
                    { id = "default"
                    , search = ""
                    , value = Nothing
                    , options = Just (List.range 0 10)
                    , toLabel = String.fromInt
                    , onInput = \a b -> logActionWithString "onInput" (result a b)
                    }
              )
            , ( "Loading"
              , W.InputAutocomplete.view [ W.InputAutocomplete.placeholder "Fetching some options…" ]
                    { id = "loading"
                    , search = ""
                    , value = Nothing
                    , options = Nothing
                    , toLabel = String.fromInt
                    , onInput = \a b -> logActionWithString "onInput" (result a b)
                    }
              )
            , ( "Read Only"
              , W.InputAutocomplete.view
                    [ W.InputAutocomplete.readOnly True
                    , W.InputAutocomplete.placeholder "You can't touch me"
                    ]
                    { id = "loading"
                    , search = ""
                    , value = Nothing
                    , options = Just (List.range 0 10)
                    , toLabel = String.fromInt
                    , onInput = \a b -> logActionWithString "onInput" (result a b)
                    }
              )
            ]
