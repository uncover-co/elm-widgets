module Chapters.Form.InputDate exposing (..)

import Date
import ElmBook.Actions exposing (logAction)
import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import Time
import W.InputDate


chapter_ : Chapter x
chapter_ =
    chapter "Input Date"
        |> renderComponentList
            [ ( "Default"
              , W.InputDate.view
                    []
                    { value = Nothing
                    , onInput =
                        \v ->
                            case v of
                                Just v_ ->
                                    logAction
                                        ("Just "
                                            ++ Date.toIsoString (Date.fromPosix Time.utc v_)
                                            ++ " "
                                            ++ String.fromInt (Time.toHour Time.utc v_)
                                            ++ ":"
                                            ++ String.fromInt (Time.toMinute Time.utc v_)
                                        )

                                Nothing ->
                                    logAction "Nothing"
                    }
              )
            , ( "Custom Timezone (GMT-3)"
              , let
                    timeZone =
                        Time.customZone (-3 * 60) []
                in
                W.InputDate.view
                    [ W.InputDate.timeZone timeZone
                    ]
                    { value = Just (Time.millisToPosix 1651693959717)
                    , onInput =
                        \v ->
                            case v of
                                Just v_ ->
                                    logAction
                                        ("Just "
                                            ++ Date.toIsoString (Date.fromPosix timeZone v_)
                                            ++ " "
                                            ++ String.fromInt (Time.toHour timeZone v_)
                                            ++ ":"
                                            ++ String.fromInt (Time.toMinute timeZone v_)
                                        )

                                Nothing ->
                                    logAction "Nothing"
                    }
              )
            ]
