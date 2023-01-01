module Main exposing (main)

import Chapters.Core.ButtonGroup
import Chapters.Core.Buttons
import Chapters.Core.Container
import Chapters.Core.Divider
import Chapters.Core.Heading
import Chapters.Core.Loading
import Chapters.Form.Field
import Chapters.Form.InputAutocomplete
import Chapters.Form.InputCheckbox
import Chapters.Form.InputColor
import Chapters.Form.InputDate
import Chapters.Form.InputFloat
import Chapters.Form.InputInt
import Chapters.Form.InputRadio
import Chapters.Form.InputSelect
import Chapters.Form.InputSlider
import Chapters.Form.InputText
import Chapters.Form.InputTextArea
import Chapters.Form.InputTime
import Chapters.Information.Badge
import Chapters.Information.DataRow
import Chapters.Information.Menu
import Chapters.Information.Message
import Chapters.Information.Notification
import Chapters.Information.Pagination
import Chapters.Information.Popover
import Chapters.Information.Table
import Chapters.Information.Tag
import Chapters.Information.Tooltip
import Chapters.Layout.Modal
import Chapters.Overview
import Chapters.Theme
import ElmBook exposing (Book, book, withChapterGroups, withStatefulOptions, withThemeOptions)
import ElmBook.Chapter
import ElmBook.StatefulOptions
import ElmBook.ThemeOptions
import Html as H
import Theme
import W.Styles


type alias SharedState =
    { overview : Chapters.Overview.Model
    , theme : Chapters.Theme.Model
    , autocomplete : Chapters.Form.InputAutocomplete.Model
    , range :
        { default : Float
        , customColor : Float
        }
    , inputText : Chapters.Form.InputText.Model
    , inputInt : Chapters.Form.InputInt.Model
    , inputFloat : Chapters.Form.InputFloat.Model
    , inputTextArea : Chapters.Form.InputTextArea.Model
    }


main : Book SharedState
main =
    book "elm-widgets"
        |> withStatefulOptions
            [ ElmBook.StatefulOptions.initialState
                { overview = Chapters.Overview.init
                , theme = Chapters.Theme.init
                , autocomplete = Chapters.Form.InputAutocomplete.init
                , range = Chapters.Form.InputSlider.init
                , inputText = Chapters.Form.InputText.init
                , inputInt = Chapters.Form.InputInt.init
                , inputFloat = Chapters.Form.InputFloat.init
                , inputTextArea = Chapters.Form.InputTextArea.init
                }
            ]
        |> withThemeOptions
            [ ElmBook.ThemeOptions.subtitle "Stateless & Tasteful"
            , ElmBook.ThemeOptions.backgroundGradient "#0087cf" Theme.primaryBackground
            , ElmBook.ThemeOptions.globals
                [ Theme.globalProviderWithDarkMode
                    { light = Theme.lightTheme
                    , dark = Theme.darkTheme
                    , strategy = Theme.classStrategy "elm-book-dark-mode"
                    }
                , W.Styles.globalStyles
                , H.node "style" [] [ H.text "@import url('https://fonts.googleapis.com/css2?family=Leckerli+One&family=Patrick+Hand&family=Press+Start+2P&family=Raleway&display=swap')" ]
                ]
            ]
        |> withChapterGroups
            [ ( ""
              , [ Chapters.Overview.chapter_
                , ElmBook.Chapter.chapterLink
                    { title = "Package Docs"
                    , url = "https://"
                    }
                ]
              )
            , ( "Basics"
              , [ Chapters.Theme.chapter_
                , Chapters.Core.Heading.chapter_
                ]
              )
            , ( "Buttons"
              , [ Chapters.Core.Buttons.chapter_
                , Chapters.Core.ButtonGroup.chapter_
                ]
              )
            , ( "Layout & Navigation"
              , [ Chapters.Core.Container.chapter_
                , Chapters.Core.Divider.chapter_
                , Chapters.Information.Menu.chapter_
                , Chapters.Layout.Modal.chapter_
                , Chapters.Information.Pagination.chapter_
                , Chapters.Information.Table.chapter_
                ]
              )
            , ( "Information"
              , [ Chapters.Information.Badge.chapter_
                , Chapters.Information.DataRow.chapter_
                , Chapters.Core.Loading.chapter_
                , Chapters.Information.Message.chapter_
                , Chapters.Information.Notification.chapter_
                , Chapters.Information.Popover.chapter_
                , Chapters.Information.Tag.chapter_
                , Chapters.Information.Tooltip.chapter_
                ]
              )
            , ( "Inputs"
              , [ Chapters.Form.Field.chapter_
                , Chapters.Form.InputText.chapter_
                , Chapters.Form.InputTextArea.chapter_
                , Chapters.Form.InputAutocomplete.chapter_
                , Chapters.Form.InputSelect.chapter_
                , Chapters.Form.InputInt.chapter_
                , Chapters.Form.InputFloat.chapter_
                , Chapters.Form.InputColor.chapter_
                , Chapters.Form.InputDate.chapter_
                , Chapters.Form.InputTime.chapter_
                , Chapters.Form.InputCheckbox.chapter_
                , Chapters.Form.InputRadio.chapter_
                , Chapters.Form.InputSlider.chapter_
                ]
              )
            ]
