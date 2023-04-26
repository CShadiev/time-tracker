from tests.e2e import basic_usecase as bu


if __name__ == '__main__':
    try:
        bu.use_case_1()
    finally:
        bu.clean_up()
