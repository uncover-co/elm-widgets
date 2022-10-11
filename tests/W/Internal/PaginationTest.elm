module W.Internal.PaginationTest exposing (suite)

import Expect exposing (equal)
import Test exposing (Test, describe, test)
import W.Internal.Pagination


suite : Test
suite =
    describe "W.Internal.Pagination.toPages"
        [ test "1 3" <|
            \_ ->
                equal
                    (W.Internal.Pagination.toPages 1 3)
                    (Ok [ 1, 2, 3 ])
        , test "1 5" <|
            \_ ->
                equal
                    (W.Internal.Pagination.toPages 1 5)
                    (Ok [ 1, 2, 3, 4, 5 ])
        , test "1 7" <|
            \_ ->
                equal
                    (W.Internal.Pagination.toPages 1 7)
                    (Ok [ 1, 2, 3, 4, 5, 6, 7 ])
        , test "1 8" <|
            \_ ->
                equal
                    (W.Internal.Pagination.toPages 1 8)
                    (Ok [ 1, 2, 3, 4, 5, -1, 8 ])
        , test "4 8" <|
            \_ ->
                equal
                    (W.Internal.Pagination.toPages 4 8)
                    (Ok [ 1, 2, 3, 4, 5, -1, 8 ])
        , test "5 8" <|
            \_ ->
                equal
                    (W.Internal.Pagination.toPages 5 8)
                    (Ok [ 1, -1, 4, 5, 6, 7, 8 ])
        , test "5 10" <|
            \_ ->
                equal
                    (W.Internal.Pagination.toPages 5 10)
                    (Ok [ 1, -1, 4, 5, 6, -1, 10 ])
        , test "9 10" <|
            \_ ->
                equal
                    (W.Internal.Pagination.toPages 9 10)
                    (Ok [ 1, -1, 6, 7, 8, 9, 10 ])
        , test "300 99999" <|
            \_ ->
                equal
                    (W.Internal.Pagination.toPages 300 99999)
                    (Ok [ 1, -1, 299, 300, 301, -1, 99999 ])
        , test "-1 99999" <|
            \_ ->
                equal
                    (W.Internal.Pagination.toPages -1 99999)
                    (Err "Active must be larger than 1 and less or equal length")
        , test "4 3" <|
            \_ ->
                equal
                    (W.Internal.Pagination.toPages 4 3)
                    (Err "Active must be larger than 1 and less or equal length")
        ]
